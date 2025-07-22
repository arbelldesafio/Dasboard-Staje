export default async function handler(req, res) {
  const { distribuidor } = req.query;

  if (!distribuidor) {
    console.error("⚠️ Falta el parámetro 'distribuidor' en la query.");
    return res.status(400).json({ success: false, message: "Falta el distribuidor" });
  }

  const url = `https://script.google.com/macros/s/AKfycbzTmw0t0zUT5bUtPI4Qrp2aUW3BdyQcV1xCe1sFDxeCbvT9F-q_wC7pByQ2fWofvL9Y/exec?distribuidor=${encodeURIComponent(distribuidor)}`;
  console.log("🔗 Consultando GAS con URL:", url);

  try {
    const response = await fetch(url);
    const text = await response.text();

    console.log("📥 Respuesta cruda del GAS:", text.slice(0, 200)); // muestra solo parte por si es muy larga

    try {
      const data = JSON.parse(text);
      console.log("✅ JSON parseado correctamente:", data);

      const filteredRows = data.rows.filter(row => row[3] === distribuidor);
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
