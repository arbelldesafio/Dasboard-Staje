export default async function handler(req, res) {
  const { email, contrasena } = req.query;

  if (!email || !contrasena) {
    return res.status(400).json({ success: false, message: 'Faltan credenciales' });
  }

  try {
    const url = `https://script.google.com/macros/s/AKfycbz40kITUJ57PMAQ6gb5OEOA3GDoYJleKgOXNEJ-Fzhux5Y9LhAa4W2oqh2Z_PlbCoSx/exec?email=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(contrasena)}`;
    
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error al contactar al script:', error);
    res.status(500).json({ success: false, message: 'Error interno en el servidor' });
  }
}
