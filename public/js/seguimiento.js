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
      "3y4": "https://script.google.com/macros/s/AKfycbzjy5b7r7acFEwTGBI7H03AVU21PPfraUZmnQhe7Hmv5H0WrL3ifLR1ntbUGhswACCE/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbweWVCzyoUo1o0n9yVolZ_FIvSG-yIPDQyyJvENqNAhICzJssJRbOA1i9dyqWorngZ3TQ/exec"
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

    // 6. Asignar enlaces con validación mejorada
    const asignarEnlace = (id, url, textoDefault) => {
      const elemento = document.getElementById(id);
      if (!elemento) {
        console.error(`Elemento ${id} no encontrado en el DOM`);
        return;
      }
      
    
      
      elemento.href = url;
      elemento.style.opacity = "1";
      elemento.style.cursor = "pointer";
      elemento.title = "";
      console.log(`Enlace asignado a ${id}: ${url}`);
    };
    
    asignarEnlace("nuevas1", data.links.nuevas1, "EQUIPO A MI CARGO");
    asignarEnlace("nuevas2", data.links.nuevas2, "EQUIPO DE MIS LIDERES INTEGRA");
    asignarEnlace("incorpo1", data.links.incorpo1, "EQUIPO A CARGO");
    asignarEnlace("incorpo2", data.links.incorpo2, "EQUIPO DE MIS LIDERES INTEGRA");

    // Verificar si todos los enlaces están deshabilitados
    const todosDeshabilitados = ["nuevas1", "nuevas2", "incorpo1", "incorpo2"].every(id => {
      const el = document.getElementById(id);
      return el && el.href === "#";
    });

    if (todosDeshabilitados) {
      bienvenidaElement.textContent += " - No hay enlaces disponibles";
      bienvenidaElement.style.color = "orange";
    } else {
      console.log("Proceso completado exitosamente");
    }

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
