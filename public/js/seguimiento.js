document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Verificar parámetros de URL (con depuración detallada)
    const urlParams = new URLSearchParams(window.location.search);
    console.log("Parámetros de URL encontrados:", Array.from(urlParams.entries()));
    
    // 2. Obtener categoría con validación estricta
    const categoria = urlParams.get('categoria');
    console.log("Categoría cruda obtenida:", categoria);
    
    if (!categoria) {
      throw new Error("El parámetro 'categoria' no está presente en la URL.\nEjemplo correcto: enlaces.html?categoria=3y4");
    }
    
    const categoriaNormalizada = categoria.toLowerCase().trim();
    console.log("Categoría normalizada:", categoriaNormalizada);
    
    // 3. Validar categorías permitidas
    const categoriasPermitidas = ["3y4", "4y5"];
    if (!categoriasPermitidas.includes(categoriaNormalizada)) {
      throw new Error(`Categoría "${categoriaNormalizada}" no válida. Use: ${categoriasPermitidas.join(" o ")}`);
    }

    // 4. Obtener distribuidor
    const distribuidor = localStorage.getItem("distribuidor");
    if (!distribuidor) {
      throw new Error("No se encontró el distribuidor en localStorage");
    }
    const distribuidorNormalizado = distribuidor.toUpperCase();
    console.log("Distribuidor:", distribuidorNormalizado);

    // 5. Configuración de endpoints
    const endpoints = {
      "3y4": "https://script.google.com/macros/s/AKfycbwKBVGe_QZrvgXt0g0ayY3rbWMW8ekYojdii-r3oRCB90UqhJvQdDhCf3jlLOP0IRHb/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbxqJuHmvFxoX6FOeIZMmLo1taBBVrBJtZZ_H9S265HXLsy00dD38bJivkJMyKcw7VyzEA/exec"
    };

    // 6. Obtener y validar URL del endpoint
    const endpoint = endpoints[categoriaNormalizada];
    if (!endpoint) {
      throw new Error(`No hay endpoint configurado para la categoría ${categoriaNormalizada}`);
    }
    console.log("Endpoint seleccionado:", endpoint);

    // 7. Hacer la petición a la API
    const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
    console.log("URL completa de API:", apiUrl);
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Error en la respuesta de la API");
    }
    console.log("Datos recibidos de la API:", data);

    // 8. Asignar enlaces a los elementos HTML
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
    console.error("Error detectado:", error);
    alert(error.message);
    window.location.href = "/dashboard.html";
  }
});
