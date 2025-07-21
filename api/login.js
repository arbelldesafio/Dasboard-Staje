export default async function handler(req, res) {
  const { email, contrasena } = req.query;

  if (!email || !contrasena) {
    return res.status(400).json({ success: false, message: 'Faltan credenciales' });
  }

  try {
    const decodedEmail = decodeURIComponent(email);
    const decodedPass = decodeURIComponent(contrasena);

    const url = `https://script.google.com/macros/s/AKfycbwQnbKz9KCd7iqjFeY74Obd3MT3iM3eGlM0kqi7gezpFxDJl-FPUVSxmzGQnus8AtSv/exec?email=${decodedEmail}&contrasena=${decodedPass}`;

    console.log("Llamando a URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Error HTTP al contactar Google Script:", response.statusText);
      return res.status(500).json({ success: false, message: 'Error en la respuesta del script' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error en el proxy:', error);
    res.status(500).json({ success: false, message: 'Error interno en el servidor' });
  }
}
