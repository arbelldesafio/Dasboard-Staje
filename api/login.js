export default async function handler(req, res) {
  try {
    const { email, contrasena } = req.query;

    if (!email || !contrasena) {
      return res.status(400).json({ success: false, message: 'Faltan credenciales' });
    }

    const url = `https://script.google.com/macros/s/AKfycbyCbsCpfa8DMiZRS9za3lYj0BXPOKarVr6u-HLKPvFT1CoWMnkimWAP-Gt-UYB_UteU/exec?email=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(contrasena)}`;

 const response = await fetch(url);
    const text = await response.text();
    
    return res.status(response.status).send(text);

    console.log('Respuesta cruda de GAS:', text);

    // Intentá parsear JSON solo si la respuesta es JSON válida
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (parseError) {
      console.error('No es JSON válido:', parseError);
      return res.status(500).json({ success: false, message: 'Respuesta inválida del servidor externo' });
    }

  } catch (error) {
    console.error('Error atrapado en catch:', error);
    return res.status(500).json({ success: false, message: 'Error interno en servidor' });
  }
}
