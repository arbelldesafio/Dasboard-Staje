
 export default async function handler(req, res) {
  try {
    const { distribuidor, categoria } = req.query;
    
    if (!distribuidor || !categoria) {
      return res.status(400).json({ 
        success: false, 
        message: "Se requieren parámetros distribuidor y categoria" 
      });
    }

    // Configuración de APIs por categoría
    const apis = {
    "3y4": "https://script.google.com/macros/s/AKfycbzg2GjCJA5ieqQhGwv7GMQSqlV8Z2uqhJzEXcTlLuUCrSjiP9CeCNHC0mCOAmpYVt6k/exec",
    "4y5": "https://script.google.com/macros/s/AKfycbwYcLTXEhg8m8cAz4TY47Lb0gHurJKhBPPy92bX7TSW9G3mT_gFZHaOEk7pEHuyLVs2bw/exec"
    };

    const apiUrl = apis[categoria.toLowerCase()];
    if (!apiUrl) {
      return res.status(400).json({ 
        success: false, 
        message: "Categoría no válida" 
      });
    }

    const url = `${apiUrl}?distribuidor=${encodeURIComponent(distribuidor)}`;
    console.log("Consultando:", url); // Para depuración

    const apiResponse = await fetch(url);
    const textData = await apiResponse.text();

    // Verificar si es un error HTML
    if (textData.startsWith("<!DOCTYPE html>")) {
      throw new Error("El servidor GAS devolvió una página de error");
    }

    const data = JSON.parse(textData);
    
    if (!data.success) {
      return res.status(404).json(data);
    }

    // Procesar datos recibidos del GAS
    const headers = data.headers?.map(h => h.toString().trim().toUpperCase()) || [];
    const rows = data.rows || [];

    // Buscar índices de columnas
    const findColIndex = (name) => headers.indexOf(name.toUpperCase());

    const distribuidorIndex = findColIndex("DISTRIBUIDOR");
    const nuevas1Index = findColIndex("NUEVA INCO A CARGO");
    const nuevas2Index = findColIndex("NUEVA INCO DE EQUIPO DE LIDER INTEGRA");
    const incorpo1Index = findColIndex("INCO A CARGO");
    const incorpo2Index = findColIndex("INCO DE EQUIPO DE LÍDER INTEGRA");

    // Validar índices esenciales
    if (distribuidorIndex === -1) {
      throw new Error("Columna DISTRIBUIDOR no encontrada");
    }

    // Filtrar filas válidas
    const validRows = rows.filter(row => 
      row[distribuidorIndex]?.toString().toUpperCase() === distribuidor.toUpperCase()
    );

    if (validRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: `No se encontraron datos para ${distribuidor}` 
      });
    }

    // Tomar la primera fila válida
    const row = validRows[0];

    // Función para validar links
    const getValidLink = (index) => {
      if (index === -1) return null;
      const value = row[index];
      return value && value.toString().startsWith("http") ? value : null;
    };

    // Construir respuesta
    return res.status(200).json({
      success: true,
      distribuidor: row[distribuidorIndex],
      categoria,
      links: {
        nuevas1: getValidLink(nuevas1Index),
        nuevas2: getValidLink(nuevas2Index),
        incorpo1: getValidLink(incorpo1Index),
        incorpo2: getValidLink(incorpo2Index)
      }
    });

  } catch (error) {
    console.error("Error en API links:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
}
