document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Mostrar estado de carga
    const bienvenidaElement = document.getElementById("bienvenida");
    bienvenidaElement.textContent = "Cargando datos del distribuidor...";

    // 1. Determinar categoría desde la URL
    const urlActual = window.location.pathname;
    const categoria = urlActual.includes('4y5') ? '4y5' : 
                     urlActual.includes('3y4') ? '3y4' : null;
    
    if (!categoria) throw new Error("No se pudo determinar la categoría");

    // 2. Obtener distribuidor
    const distribuidor = localStorage.getItem("distribuidor");
    if (!distribuidor) throw new Error("Distribuidor no encontrado");
    const distribuidorNormalizado = distribuidor.toUpperCase();
    bienvenidaElement.textContent = `Distribuidor: ${distribuidorNormalizado}`;

    // 3. Configurar endpoints
    const endpoints = {
      "3y4": "https://script.google.com/macros/s/AKfycbwGETGGFQxPHjGNCIHukemiIEBhYXMDWHAve-0IF78liDeyc-uKPSsltAfFKVru2iTx/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbxFPcxZ6Whe5MRJmLX5YMMTHOP6E49UYC_E4hPmaY37APw9xpefrp8g_5W82_PfSF0grw/exec"
    };

    const endpoint = endpoints[categoria];
    if (!endpoint) throw new Error("Endpoint no configurado");

    // 4. Obtener datos de la API
    const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
    const data = await response.json();
    console.log("Datos recibidos:", data);

    if (!data.success) throw new Error(data.error || "Error en la API");

    // 5. Asignar enlaces (estructura consistente para ambos períodos)
    const asignarEnlace = (id, url) => {
      const elemento = document.getElementById(id);
      if (!elemento) {
        console.warn(`Elemento ${id} no encontrado`);
        return;
      }
      
      if (!url) {
        elemento.style.opacity = "0.6";
        elemento.style.cursor = "not-allowed";
        elemento.onclick = (e) => e.preventDefault();
        elemento.title = "Enlace no disponible";
        return;
      }
      
      elemento.href = url;
      elemento.style.opacity = "1";
      elemento.style.cursor = "pointer";
    };

    // Asignación para ambos períodos (misma estructura)
    asignarEnlace("nuevas1", data.links.nuevas1);
    asignarEnlace("nuevas2", data.links.nuevas2);
    asignarEnlace("incorpo1", data.links.incorpo1);
    asignarEnlace("incorpo2", data.links.incorpo2);

  } catch (error) {
    console.error("Error:", error);
    const bienvenidaElement = document.getElementById("bienvenida");
    if (bienvenidaElement) {
      bienvenidaElement.textContent = `Error: ${error.message}`;
      bienvenidaElement.style.color = "red";
    }
    
    // Botón de reintento
    const boton = document.createElement("button");
    boton.textContent = "Reintentar";
    boton.className = "boton-link";
    boton.onclick = () => window.location.reload();
    document.querySelector(".seccion")?.appendChild(boton);
  }
});
