document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Determinar la categoría desde el nombre de la página
    const urlActual = window.location.pathname; // Ej: "/periodo4y5.html"
    console.log("URL actual:", urlActual);
    
    // Extraer la categoría del nombre del archivo
    const categoria = urlActual.includes('4y5') ? '4y5' : 
                     urlActual.includes('3y4') ? '3y4' : null;
    
    console.log("Categoría detectada:", categoria);

    // 2. Validación de categoría
    if (!categoria) {
      throw new Error("No se pudo determinar la categoría desde la URL.\nEl archivo debe llamarse 'periodo3y4.html' o 'periodo4y5.html'");
    }

    // 3. Obtener distribuidor
    const distribuidor = localStorage.getItem("distribuidor");
    if (!distribuidor) {
      throw new Error("No se encontró el distribuidor en localStorage");
    }
    const distribuidorNormalizado = distribuidor.toUpperCase();
    console.log("Distribuidor:", distribuidorNormalizado);

    // 4. Configuración de endpoints
    const endpoints = {
      "3y4": "https://script.google.com/macros/s/AKfycbwKBVGe_QZrvgXt0g0ayY3rbWMW8ekYojdii-r3oRCB90UqhJvQdDhCf3jlLOP0IRHb/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbxqJuHmvFxoX6FOeIZMmLo1taBBVrBJtZZ_H9S265HXLsy00dD38bJivkJMyKcw7VyzEA/exec"
    };

    const endpoint = endpoints[categoria];
    if (!endpoint) {
      throw new Error(`No hay endpoint configurado para la categoría ${categoria}`);
    }
    console.log("Endpoint seleccionado:", endpoint);

    // 5. Hacer la petición a la API
    const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
    console.log("URL completa de API:", apiUrl);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Error en la respuesta de la API");
    }
    console.log("Datos recibidos de la API:", data);

    // 6. Asignar enlaces a los elementos HTML
    const asignarEnlace = (id, url) => {
      const elemento = document.getElementById(id);
      if (!elemento) {
        console.warn(`Elemento con ID ${id} no encontrado`);
        return;
      }
      elemento.href = url;
      console.log(`Asignado ${id}: ${url}`);
    };

    asignarEnlace("nuevas1", data.links.nuevas1);
    asignarEnlace("nuevas2", data.links.nuevas2);
    asignarEnlace("incorpo1", data.links.incorpo1);
    asignarEnlace("incorpo2", data.links.incorpo2);

    console.log("Proceso completado exitosamente");

  } catch (error) {
    console.error("Error detectado:", {
      mensaje: error.message,
      stack: error.stack,
      url: window.location.href
    });
    
    alert(`Error: ${error.message}`);
    window.location.href = "/dashboard.html";
  }
});
