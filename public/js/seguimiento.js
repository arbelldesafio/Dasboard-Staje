async function cargarDatosPeriodo(categoria) {
  try {
    const distribuidor = localStorage.getItem("distribuidor");
    if (!distribuidor) throw new Error("No hay sesión activa");

    // URLs de tus 2 GAS (cada uno vinculado a su Sheet respectivo)
    const URLs = {
      "3y4": "https://script.google.com/macros/s/AKfycbwKBVGe_QZrvgXt0g0ayY3rbWMW8ekYojdii-r3oRCB90UqhJvQdDhCf3jlLOP0IRHb/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbxqJuHmvFxoX6FOeIZMmLo1taBBVrBJtZZ_H9S265HXLsy00dD38bJivkJMyKcw7VyzEA/exec"
    };

    const response = await fetch(`${URLs[categoria]}?distribuidor=${encodeURIComponent(distribuidor)}`);
    const data = await response.json();

    if (!data.success) throw new Error(data.error || "Error en los datos");

    // Actualizar UI
    actualizarLinks(data.links);
    
  } catch (error) {
    console.error("Error:", error);
    alert(`Error al cargar ${categoria}: ${error.message}`);
  }
}

function actualizarLinks(links) {
  const asignarLink = (id, url) => {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.href = url || "#";
      elemento.style.opacity = url ? 1 : 0.6;
      elemento.onclick = !url ? (e) => e.preventDefault() : null;
    }
  };

  asignarLink("link-nuevas1", links.nuevas1);
  asignarLink("link-nuevas2", links.nuevas2);
  asignarLink("link-incorpo1", links.incorpo1);
  asignarLink("link-incorpo2", links.incorpo2);
}
