export default async function handler(req, res) {
  const { distribuidor, categoria } = req.query;

  if (!distribuidor || !categoria) {
    return res.status(400).json({ success: false, message: "Faltan parámetros" });
  }

  const urlsPorCategoria = {
    "3y4": "https://script.google.com/macros/s/AKfycbxkVeUvL8PHDB2cutO91hY81o9AUdNE3eZ3gU-3mck836l1j6UDKKoKWhIc0xfbYbmy/exec",
    "4y5": "https://script.google.com/macros/s/AKfycbxj1lxyzfhFA38qDsstaq0XpulNp301D4BQhBZyGdrDXos3hKToSBKRZMpZsSuGXKfNmg/exec"
  };

  try {
    const url = `${urlsPorCategoria[categoria]}?distribuidor=${encodeURIComponent(distribuidor)}&categoria=${encodeURIComponent(categoria)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      return res.status(404).json(data);
    }

    // Procesar la respuesta del GAS
    const headers = data.headers.map(h => h.toString().trim().toUpperCase());
    const rows = data.rows;

    // Encontrar índices de columnas
    const distribuidorIndex = headers.indexOf("DISTRIBUIDOR");
    const nuevas1Index = headers.indexOf("NUEVA INCO A CARGO");
    const nuevas2Index = headers.indexOf("NUEVA INCO DE EQUIPO DE LIDER INTEGRA");
    const incorpo1Index = headers.indexOf("INCO A CARGO");
    const incorpo2Index = headers.indexOf("INCO DE EQUIPO DE LÍDER INTEGRA");

    // Filtrar filas válidas (ignorar celdas vacías o #N/A)
    const validRows = rows.filter(row => 
      row[distribuidorIndex]?.toString().toUpperCase() === distribuidor.toUpperCase()
    );

    if (validRows.length === 0) {
      return res.status(404).json({ success: false, message: "No se encontraron datos" });
    }

    // Tomar la primera fila válida (asumiendo que es la correcta)
    const row = validRows[0];

    // Construir respuesta
    const resultado = {
      distribuidor: row[distribuidorIndex],
      categoria: categoria,
      links: {
        nuevas1: row[nuevas1Index]?.toString().startsWith("http") ? row[nuevas1Index] : null,
        nuevas2: row[nuevas2Index]?.toString().startsWith("http") ? row[nuevas2Index] : null,
        incorpo1: row[incorpo1Index]?.toString().startsWith("http") ? row[incorpo1Index] : null,
        incorpo2: row[incorpo2Index]?.toString().startsWith("http") ? row[incorpo2Index] : null
      }
    };

    return res.status(200).json({ success: true, ...resultado });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Error interno",
      error: error.message 
    });
  }
}
