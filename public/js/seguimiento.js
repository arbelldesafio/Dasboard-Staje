document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Obtener y validar distribuidor
    const distribuidor = localStorage.getItem("distribuidor")?.toUpperCase();
    if (!distribuidor) {
      alert("Error: No se encontró el distribuidor en localStorage");
      window.location.href = "/dashboard.html";
      return;
    }

    // Obtener y validar categoría
    const categoria = new URLSearchParams(window.location.search).get("categoria")?.toLowerCase().trim();
    const categoriasPermitidas = ["3y4", "4y5"];
    
    if (!categoria || !categoriasPermitidas.includes(categoria)) {
      alert(`Categoría inválida. Use: ${categoriasPermitidas.join(" o ")}`);
      window.location.href = "/dashboard.html";
      return;
    }

    // Depuración
    console.debug("Datos cargados:", {
      url: window.location.href,
      params: Object.fromEntries(new URLSearchParams(window.location.search)),
      distribuidor,
      categoria
    });

    // Configuración de URLs
    const urls = {
      "3y4": "https://script.google.com/macros/s/AKfycbwKBVGe_QZrvgXt0g0ayY3rbWMW8ekYojdii-r3oRCB90UqhJvQdDhCf3jlLOP0IRHb/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbxqJuHmvFxoX6FOeIZMmLo1taBBVrBJtZZ_H9S265HXLsy00dD38bJivkJMyKcw7VyzEA/exec"
    };

    const urlAPI = urls[categoria];
    if (!urlAPI) {
      throw new Error(`No hay URL configurada para la categoría ${categoria}`);
    }

    console.log("Conectando con API:", urlAPI);

    // Obtener datos de la API
    const response = await fetch(`${urlAPI}?distribuidor=${encodeURIComponent(distribuidor)}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "La API no devolvió success=true");
    }

    // Asignar enlaces
    const asignarEnlace = (id, url) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        elemento.href = url;
        console.log(`Enlace ${id} asignado:`, url);
      } else {
        console.warn(`Elemento #${id} no encontrado en el DOM`);
      }
    };

    asignarEnlace("nuevas1", data.links.nuevas1);
    asignarEnlace("nuevas2", data.links.nuevas2);
    asignarEnlace("incorpo1", data.links.incorpo1);
    asignarEnlace("incorpo2", data.links.incorpo2);

    console.log("Todos los enlaces fueron asignados correctamente");

  } catch (error) {
    console.error("Error en la aplicación:", error);
    alert(`Error: ${error.message}\n\nSerás redirigido al dashboard.`);
    window.location.href = "/dashboard.html";
  }
});
