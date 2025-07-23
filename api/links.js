export default async function handler(req, res) {
  const { distribuidor, categoria } = req.query;

  if (!distribuidor || !categoria) {
    console.error("⚠️ Faltan parámetros: distribuidor o categoria");
    return res.status(400).json({ success: false, message: "Faltan parámetros" });
  }

  const urlsPorCategoria = {
    "3y4": "https://script.google.com/macros/s/AKfycbz6KeHTitTOd3sACu5AWJSZ8ZN0Tn2urUhk1bFgEwepqxzQ4RwGMbd8UIid2cn1FUqD/exec",
    "4y5": "https://script.google.com/macros/s/AKfycbxj1lxyzfhFA38qDsstaq0XpulNp301D4BQhBZyGdrDXos3hKToSBKRZMpZsSuGXKfNmg/exec"
  };

  const keyCategoria = categoria.toLowerCase().trim();
  const urlBase = urlsPorCategoria[keyCategoria];

  if (!urlBase) {
    console.error("❌ Categoría inválida:", categoria);
    return res.status(400).json({ success: false, message: "Categoría inválida" });
  }

  const url = `${urlBase}?distribuidor=${encodeURIComponent(distribuidor)}`;
  console.log("🔗 Consultando GAS con URL:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();

    console.log("📥 Respuesta COMPLETA del GAS:", text); // <-- Esto es crucial para debug

    // Verifica si la respuesta es un error HTML
    if (text.startsWith("<!DOCTYPE html>") || text.includes("Error")) {
      console.error("❌ El GAS devolvió un error HTML");
      return res.status(500).json({ 
        success: false, 
        message: "El servidor externo devolvió un error",
        error: text.slice(0, 500) // Muestra solo parte del error
      });
    }

    try {
      const data = JSON.parse(text);
      console.log("✅ JSON parseado correctamente:", data);

      // Verifica si la estructura de datos es la esperada
      if (!data.rows) {
        console.error("❌ Estructura de datos inesperada:", data);
        return res.status(500).json({ 
          success: false, 
          message: "Estructura de datos inesperada del servidor externo",
          response: data
        });
      }

      const filteredRows = data.rows.filter(row => {
        // Verifica que la fila tenga las columnas necesarias
        if (!row || row.length < 4) return false;
        
        return row[3]?.toString().trim().toLowerCase() === distribuidor.toLowerCase().trim() &&
               row[0]?.toString().trim().toLowerCase() === keyCategoria;
      });

      console.log(`🎯 Filtradas ${filteredRows.length} filas para distribuidor "${distribuidor}"`);

      return res.status(200).json({
        success: true,
        rows: filteredRows
      });
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err.message);
      console.error("Contenido recibido:", text.slice(0, 500));
      return res.status(500).json({ 
        success: false, 
        message: "Respuesta inválida del servidor externo",
        error: err.message,
        response: text.slice(0, 500)
      });
    }
  } catch (error) {
    console.error("❌ Error al conectar con GAS:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno",
      error: error.message
    });
  }
}
