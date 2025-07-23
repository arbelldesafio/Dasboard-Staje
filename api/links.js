export default async function handler(req, res) {
  const { distribuidor, categoria } = req.query;

  if (!distribuidor || !categoria) {
    console.error("⚠️ Faltan parámetros: distribuidor o categoria");
    return res.status(400).json({ success: false, message: "Faltan parámetros" });
  }

  const urlsPorCategoria = {
    "3y4": "https://script.google.com/macros/s/AKfycbyfxV8JYMaMZOjNo7OsCDVl3qU5PF9qUGTUZky5JFBXCnnn-97LCRn5RIqtD4Na4vo1/exec",
    "4y5": "https://script.google.com/macros/s/AKfycbxj1lxyzfhFA38qDsstaq0XpulNp301D4BQhBZyGdrDXos3hKToSBKRZMpZsSuGXKfNmg/exec"
  };

  const keyCategoria = categoria.toLowerCase().trim();
  const urlBase = urlsPorCategoria[keyCategoria];

  if (!urlBase) {
    console.error("❌ Categoría inválida:", categoria);
    return res.status(400).json({ success: false, message: "Categoría inválida" });
  }

  const url = `${urlBase}?distribuidor=${encodeURIComponent(distribuidor)}&categoria=${encodeURIComponent(categoria)}`;
  console.log("🔗 Consultando GAS con URL:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();

    if (text.startsWith("<!DOCTYPE html>") || text.includes("Error")) {
      console.error("❌ El GAS devolvió un error HTML");
      return res.status(500).json({ 
        success: false, 
        message: "El servidor externo devolvió un error",
        error: text.slice(0, 500)
      });
    }

    const data = JSON.parse(text);
    
    if (!data.success) {
      return res.status(404).json({
        success: false,
        message: data.message || "No se encontraron resultados",
        error: data.error
      });
    }

    // Ya viene filtrado del GS, no necesitamos filtrar de nuevo
    if (!data.data || data.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron resultados para el distribuidor"
      });
    }

    // Tomamos el primer resultado (debería ser el único si los nombres son únicos)
    const resultado = data.data[0];
    
    return res.status(200).json({
      success: true,
      distribuidor: resultado.distribuidor,
      categoria: resultado.categoria,
      links: resultado.links
    });

  } catch (error) {
    console.error("❌ Error al conectar con GAS:", error.message);
    return res.status(500).json({ 
      success: false, 
      message: "Error interno",
      error: error.message
    });
  }
}
