export default async function handler(req, res) {
  const { distribuidor, categoria } = req.query;

  if (!distribuidor || !categoria) {
    return res.status(400).json({ success: false, message: "Faltan parámetros" });
  }

  const urlsPorCategoria = {
    "3y4": "https://script.google.com/macros/s/AKfycbzg2GjCJA5ieqQhGwv7GMQSqlV8Z2uqhJzEXcTlLuUCrSjiP9CeCNHC0mCOAmpYVt6k/exec",
    "4y5": "https://script.google.com/macros/s/AKfycbwYcLTXEhg8m8cAz4TY47Lb0gHurJKhBPPy92bX7TSW9G3mT_gFZHaOEk7pEHuyLVs2bw/exec"
  };

  try {
    const url = `${urlsPorCategoria[categoria]}?distribuidor=${encodeURIComponent(distribuidor)}`;
    console.log("Consultando URL:", url); // Para depuración
    
    const response = await fetch(url);
    const textData = await response.text(); // Primero obtener como texto
    
    // Verificar si la respuesta es HTML (error)
    if (textData.startsWith("<!DOCTYPE html>") || textData.includes("Error")) {
      throw new Error("El GAS devolvió una página de error");
    }
    
    // Parsear a JSON
    const data = JSON.parse(textData);
    
    if (!data.success) {
      return res.status(404).json(data);
    }

    // Validar estructura de datos
    if (!data.headers || !data.rows) {
      throw new Error("Estructura de datos incorrecta del GAS");
    }

    const headers = data.headers.map(h => h.toString().trim().toUpperCase());
    const rows = data.rows;

    // Encontrar índices de columnas
    const periodoIndex = headers.indexOf("PERIODO");
    const distribuidorIndex = headers.indexOf("DISTRIBUIDOR");
    const nuevas1Index = headers.indexOf("NUEVA INCO A CARGO"); 
    const nuevas2Index = headers.indexOf("NUEVA INCO DE EQUIPO DE LIDER INTEGRA");
    const incorpo1Index = headers.indexOf("INCO A CARGO"); 
    const incorpo2Index = headers.indexOf("INCO DE EQUIPO DE LÍDER INTEGRA");

    // Validar índices
    if (distribuidorIndex === -1) {
      throw new Error("Columna DISTRIBUIDOR no encontrada");
    }

    // Filtrar por período Y distribuidor
    const filasValidas = rows.filter(row => {
      const periodoRow = periodoIndex >= 0 ? row[periodoIndex]?.toString().toLowerCase() : "";
      const distribuidorRow = row[distribuidorIndex]?.toString().toUpperCase();
      
      return (!categoria || periodoRow.includes(categoria.toLowerCase())) && 
             distribuidorRow === distribuidor.toUpperCase();
    });

    if (filasValidas.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: `No se encontraron datos para ${distribuidor} en período ${categoria}`
      });
    }

    // Tomar la primera fila válida
    const row = filasValidas[0];
    
    // Función auxiliar para validar links
    const getValidLink = (value) => {
      if (!value || value.toString().trim() === "#N/A") return null;
      return value.toString().startsWith("http") ? value : null;
    };

    // Construir respuesta
    const resultado = {
      distribuidor: row[distribuidorIndex],
      categoria: categoria,
      links: {
        nuevas1: getValidLink(nuevas1Index >= 0 ? row[nuevas1Index] : null),
        nuevas2: getValidLink(nuevas2Index >= 0 ? row[nuevas2Index] : null),
        incorpo1: getValidLink(incorpo1Index >= 0 ? row[incorpo1Index] : null),
        incorpo2: getValidLink(incorpo2Index >= 0 ? row[incorpo2Index] : null)
      }
    };

    return res.status(200).json({ success: true, ...resultado });

  } catch (error) {
    console.error("Error en handler:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
}
