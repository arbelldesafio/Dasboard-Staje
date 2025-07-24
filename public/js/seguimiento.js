  document.addEventListener("DOMContentLoaded", async () => {
    const distribuidor = localStorage.getItem("distribuidor")?.toUpperCase();
    const categoria = new URLSearchParams(window.location.search).get("categoria")?.toUpperCase() || "3Y4";

    if (!distribuidor) {
      alert("No hay distribuidor logueado.");
      return;
    }

    // URLs de tus 2 GAS (cada uno vinculado a su Sheet respectivo)
    const urls  = {
      "3y4": "https://script.google.com/macros/s/AKfycbwKBVGe_QZrvgXt0g0ayY3rbWMW8ekYojdii-r3oRCB90UqhJvQdDhCf3jlLOP0IRHb/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbxqJuHmvFxoX6FOeIZMmLo1taBBVrBJtZZ_H9S265HXLsy00dD38bJivkJMyKcw7VyzEA/exec"
    };

      const url = urls[categoria];
    if (!url) {
      alert("Categoría inválida.");
      return;
    }

    try {
      const res = await fetch(`${url}?distribuidor=${distribuidor}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Error desconocido");
      }

      console.log("Links recibidos:", data.links); // 🔍 para depurar

      // Aquí mostrarías los enlaces, por ejemplo:
      document.getElementById("nuevas1").href = data.links.nuevas1;
      document.getElementById("nuevas2").href = data.links.nuevas2;
      document.getElementById("incorpo1").href = data.links.incorpo1;
      document.getElementById("incorpo2").href = data.links.incorpo2;

    } catch (err) {
      console.error("Error al cargar los enlaces:", err.message);
      alert("No se pudieron cargar los enlaces: " + err.message);
    }
  });
