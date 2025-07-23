export default async function handler(req, res) {
  const { distribuidor, categoria } = req.query;

  if (!distribuidor || !categoria) {
    console.error("⚠️ Faltan parámetros: distribuidor o categoria");
    return res.status(400).json({ success: false, message: "Faltan parámetros" });
  }

  const urlsPorCategoria = {
    "3y4": "https://script.google.com/macros/s/AKfycbwa6LGOkfYaGXuphXWG3An_AzGDEroilda5zcjZVan_RzdkIXANCX7k5QWxQ2kJn4fF/exec",
    "4y5": "https://script.google.com/macros/s/AKfycbzMiG6Cqzk32xW_FlXzAOWyZPlZgNQr0Mkb7wJ_J12eq-QJjJYNfLnTogGtXr3On-dqaQ/exec"
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

    console.log("📥 Respuesta cruda del GAS:", text.slice(0, 200));

    try {
      const data = JSON.parse(text);
      console.log("✅ JSON parseado correctamente:", data);

      const filteredRows = data.rows.filter(row =>
        row[3].trim().toLowerCase() === distribuidor.trim().toLowerCase() &&
        row[0].trim().toLowerCase() === keyCategoria // La columna PERIODO (A) debe coincidir con la categoría
      );

      console.log(`🎯 Filtradas ${filteredRows.length} filas para distribuidor "${distribuidor}"`);

      return res.status(200).json({
        success: true,
        rows: filteredRows
      });
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err.message);
      return res.status(500).json({ success: false, message: "Respuesta inválida del servidor externo" });
    }
  } catch (error) {
    console.error("❌ Error al conectar con GAS:", error.message);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
}
