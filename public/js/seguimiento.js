document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Mostrar estado de carga
    const bienvenidaElement = document.getElementById("bienvenida");
    bienvenidaElement.textContent = "Cargando datos del distribuidor...";

    // 1. Obtener categoría de la URL
    const urlActual = window.location.pathname;
    const categoria = urlActual.includes('4y5') ? '4y5' : 
                     urlActual.includes('3y4') ? '3y4' : null;
    
    if (!categoria) throw new Error("No se pudo determinar la categoría desde la URL");

    // 2. Obtener distribuidor
    const distribuidor = localStorage.getItem("distribuidor");
    if (!distribuidor || distribuidor.trim() === "") {
      throw new Error("No se encontró el distribuidor en localStorage");
    }
    const distribuidorNormalizado = distribuidor.toUpperCase();
    bienvenidaElement.textContent = `Distribuidor: ${distribuidorNormalizado}`;

    // 3. Configurar endpoints
    const endpoints = {
      "3y4": "https://script.google.com/macros/s/AKfycbwKBVGe_QZrvgXt0g0ayY3rbWMW8ekYojdii-r3oRCB90UqhJvQdDhCf3jlLOP0IRHb/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbzBjskJ5C9LKJEMTyKUULpCMlwc0REdC7SqhjblEwsxYh2s-M2KlNJtCulRQ4OgNoaciQ/exec"
    };

    const endpoint = endpoints[categoria];
    if (!endpoint) throw new Error("No hay endpoint configurado para esta categoría");

    // 4. Obtener datos de la API
    const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
    console.log("Consultando API:", apiUrl);
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
    const data = await response.json();
    console.log("Respuesta de la API:", data);
    
    if (!data.success) throw new Error(data.error || "Error en la respuesta de la API");

    // 5. Validar estructura de datos
    if (!data.links || typeof data.links !== 'object') {
      throw new Error("La API no devolvió la estructura esperada de enlaces");
    }

    // 6. Asignar enlaces con validación
    const asignarEnlace = (id, url) => {
      const elemento = document.getElementById(id);
      if (!elemento) {
        console.warn(`Elemento ${id} no encontrado en el DOM`);
        return;
      }
      
      if (!url || typeof url !== 'string' || url.trim() === '') {
        console.warn(`URL no válida para ${id}`);
        elemento.style.display = 'none'; // Ocultar si no hay URL válida
        return;
      }
      
      elemento.href = url;
      console.log(`Enlace asignado a ${id}: ${url}`);
    };

    // Asignar enlaces (ajustado a los IDs de tu HTML)
    asignarEnlace("nuevas1", data.links.nuevas1);
    asignarEnlace("nuevas2", data.links.nuevas2);
    asignarEnlace("incorpo1", data.links.incorpo1);
    asignarEnlace("incorpo2", data.links.incorpo2);

    console.log("Proceso completado exitosamente");

  } catch (error) {
    console.error("Error en la aplicación:", error);
    
    // Mostrar error en la interfaz
    const bienvenidaElement = document.getElementById("bienvenida");
    if (bienvenidaElement) {
      bienvenidaElement.textContent = `Error: ${error.message}`;
      bienvenidaElement.style.color = "red";
    }
    
    // Crear botón de reintento
    const botonReintentar = document.createElement("button");
    botonReintentar.textContent = "Reintentar";
    botonReintentar.className = "boton-link";
    botonReintentar.onclick = () => window.location.reload();
    document.querySelector(".seccion")?.appendChild(botonReintentar);
  }
});
