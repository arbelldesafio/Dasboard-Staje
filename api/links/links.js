export default async function handler(req, res) {
  const { distribuidor } = req.query;

  if (!distribuidor) {
    return res.status(400).json({ success: false, message: "Falta el distribuidor" });
  }

  const url = `https://script.google.com/macros/s/AKfycbzTmw0t0zUT5bUtPI4Qrp2aUW3BdyQcV1xCe1sFDxeCbvT9F-q_wC7pByQ2fWofvL9Y/exec?distribuidor=${encodeURIComponent(distribuidor)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (err) {
      console.error("Error al parsear JSON:", err);
      return res.status(500).json({ success: false, message: "Respuesta inválida del servidor externo" });
    }
  } catch (error) {
    console.error("Error al conectar con GAS:", error);
    return res.status(500).json({ success: false, message: "Error interno" });
  }
}
