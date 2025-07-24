
 document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Mostrar estado de carga
    const bienvenidaElement = document.getElementById("bienvenida");
    bienvenidaElement.textContent = "Cargando datos del distribuidor...";

    // 1. Determinar la categoría desde el nombre de la página
    const urlActual = window.location.pathname;
    console.log("URL actual:", urlActual);
    
    // Extraer la categoría del nombre del archivo
    const categoria = urlActual.includes('4y5') ? '4y5' : 
                     urlActual.includes('3y4') ? '3y4' : null;
    
    console.log("Categoría detectada:", categoria);

    // 2. Validación de categoría
    if (!categoria) {
      throw new Error("No se pudo determinar la categoría desde la URL");
    }

    // 3. Obtener distribuidor con reintentos
    let distribuidor = null;
    let intentos = 3;
    
    while (intentos > 0 && !distribuidor) {
      distribuidor = localStorage.getItem("distribuidor");
      if (!distribuidor) {
        console.warn(`Distribuidor no encontrado (intentos restantes: ${intentos-1})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        intentos--;
      }
    }
    
    if (!distribuidor) {
      throw new Error("No se encontró el distribuidor en localStorage después de 3 intentos");
    }
    
    const distribuidorNormalizado = distribuidor.toUpperCase();
    console.log("Distribuidor:", distribuidorNormalizado);
    bienvenidaElement.textContent = `Distribuidor: ${distribuidorNormalizado}`;

    // 4. Configuración de endpoints
    const endpoints = {
      "3y4": "https://script.google.com/macros/s/AKfycbzjy5b7r7acFEwTGBI7H03AVU21PPfraUZmnQhe7Hmv5H0WrL3ifLR1ntbUGhswACCE/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbweWVCzyoUo1o0n9yVolZ_FIvSG-yIPDQyyJvENqNAhICzJssJRbOA1i9dyqWorngZ3TQ/exec"
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
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Error en la respuesta de la API");
    }
    console.log("Datos recibidos de la API:", data);

    // 6. Asignar enlaces a los elementos HTML (con los IDs correctos)
    const asignarEnlace = (id, url) => {
      const elemento = document.getElementById(id);
      if (!elemento) {
        throw new Error(`Elemento con ID ${id} no encontrado en el HTML`);
      }
      elemento.href = url;
      console.log(`Asignado ${id}: ${url}`);
    };

    // Usando los IDs que tienes en tu HTML actual
    asignarEnlace("nuevas1", data.nuevas1);
    asignarEnlace("nuevas2", data.nuevas2);
    asignarEnlace("incorpo1".links.incorpo1);
    asignarEnlace("incorpo2".links.incorpo2);

    console.log("Proceso completado exitosamente");

  } catch (error) {
    console.error("Error detectado:", {
      mensaje: error.message,
      stack: error.stack,
      url: window.location.href
    });
    
    const bienvenidaElement = document.getElementById("bienvenida");
    bienvenidaElement.textContent = `Error: ${error.message}`;
    bienvenidaElement.style.color = "red";
    
    // Opcional: Mostrar botón de reintento
    const botonReintentar = document.createElement("button");
    botonReintentar.textContent = "Reintentar";
    botonReintentar.className = "boton-link";
    botonReintentar.onclick = () => window.location.reload();
    document.querySelector(".seccion").appendChild(botonReintentar);
  }
});
