document.addEventListener("DOMContentLoaded", async () => {
  const distribuidor = localStorage.getItem("distribuidor")?.toUpperCase();
  const categoria = new URLSearchParams(window.location.search).get("categoria")?.toLowerCase().trim();

  // Lista de categorías permitidas
  const categoriasPermitidas = ["3y4", "4y5"];

  if (!categoria || !categoriasPermitidas.includes(categoria)) {
    alert(`Categoría inválida. Usá: ${categoriasPermitidas.join(" o ")}`);
    window.location.href = `/dashboard.html`; // Redirige a una página segura
    return;
  }

    console.log("Distribuidor:", distribuidor);
    console.log("Categoría recibida:", categoria);

    const hoja = obtenerNombreHoja(categoria);
    if (!hoja) {
      alert("Categoría inválida.");
      return;
    }

    const urls  = {
      "3y4": "https://script.google.com/macros/s/AKfycbwKBVGe_QZrvgXt0g0ayY3rbWMW8ekYojdii-r3oRCB90UqhJvQdDhCf3jlLOP0IRHb/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbxqJuHmvFxoX6FOeIZMmLo1taBBVrBJtZZ_H9S265HXLsy00dD38bJivkJMyKcw7VyzEA/exec"
    };

      const url = urls[categoria];
    console.log("URL seleccionada:", url);

    if (!url) {
      alert("URL no definida para esta categoría.");
      return;
    }

    try {
      const res = await fetch(`${url}?distribuidor=${distribuidor}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Error desconocido");
      }

      console.log("Links recibidos:", data.links);

      // Mostrar enlaces
      document.getElementById("nuevas1").href = data.links.nuevas1;
      document.getElementById("nuevas2").href = data.links.nuevas2;
      document.getElementById("incorpo1").href = data.links.incorpo1;
      document.getElementById("incorpo2").href = data.links.incorpo2;

    } catch (err) {
      console.error("Error al cargar los enlaces:", err.message);
      alert("No se pudieron cargar los enlaces: " + err.message);
    }
  });
