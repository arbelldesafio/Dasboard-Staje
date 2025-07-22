export default async function handler(req, res) {
  const { distribuidor } = req.query;

  if (!distribuidor) {
    return res.status(400).json({ success: false, message: "Falta el parámetro 'distribuidor'" });
  }

  try {
    const response = await fetch(`https://script.google.com/macros/s/AKfycbyxeAgGZ_NSFttPsUj5ufcHP3_lc7-IpTT9E_AVY_Jy0eGSpkQS4ZklYXf7tzH0yMn2/exec?distribuidor=${encodeURIComponent(distribuidor)}`);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error al consultar distribuidor:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}
