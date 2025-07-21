export default async function handler(req, res) {
  console.log('Handler started');
  const { email, contrasena } = req.query;
  console.log('Recibido:', email, contrasena);

  if (!email || !contrasena) {
    console.log('Faltan credenciales');
    return res.status(400).json({ success: false, message: 'Faltan credenciales' });
  }

  try {
const url = `https://script.google.com/macros/s/AKfycbwrBw38gn7gQd0vIjzGWzGyqqu7WXusOZT9RQkfWGfnu3KMmo1JxUR47F6C1MHGzdg/exec?email=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(contrasena)}`;

    console.log('Llamando a URL:', url);

    const response = await fetch(url);
    if (!response.ok) {
      console.log('Error HTTP:', response.status, response.statusText);
      return res.status(500).json({ success: false, message: 'Error en Google Apps Script' });
    }

    const data = await response.json();
    console.log('Datos recibidos:', data);
    return res.status(200).json(data);

  } catch (error) {
    console.log('Error catch:', error);
    return res.status(500).json({ success: false, message: 'Error interno en servidor' });
  }
}
