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

    // 4. Obtener datos de la API con validación robusta
    const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
    const data = await response.json();
    console.log("Datos recibidos:", data);

    // Validación exhaustiva de la respuesta
    if (!data || typeof data !== 'object') {
      throw new Error("Formato de respuesta inválido");
    }
    
    if (!data.success) {
      throw new Error(data.error || "Error en la API");
    }
    
    if (!data.links || typeof data.links !== 'object') {
      throw new Error("Estructura de links no encontrada en la respuesta");
    }

    // 5. Función para manejar elementos con seguridad
    const manejarElemento = (elemento, url) => {
      if (!elemento) {
        console.warn(`Elemento no encontrado`);
        return;
      }
      
      // Limpiar eventos anteriores
      elemento.replaceWith(elemento.cloneNode(true));
      const newElement = document.getElementById(elemento.id);
      
      if (url) {
        // Si tiene URL válida
        if (newElement.tagName === 'A') {
          newElement.href = url;
        }
        newElement.style.opacity = "1";
        newElement.style.cursor = "pointer";
        newElement.classList.remove('disabled');
        
        // Prevenir múltiples clics
        newElement.addEventListener('click', (e) => {
          if (!url) {
            e.preventDefault();
            return false;
          }
          // Agregar clase de carga
          newElement.classList.add('loading');
          setTimeout(() => newElement.classList.remove('loading'), 1000);
        });
      } else {
        // Si no tiene URL
        newElement.style.opacity = "0.6";
        newElement.style.cursor = "not-allowed";
        newElement.classList.add('disabled');
        newElement.onclick = (e) => {
          e.preventDefault();
          return false;
        };
      }
    };

    // Aplicar con validación a cada elemento
    if (data.links) {
      manejarElemento(document.getElementById("nuevas1"), data.links.nuevas1 || null);
      manejarElemento(document.getElementById("nuevas2"), data.links.nuevas2 || null);
      manejarElemento(document.getElementById("incorpo1"), data.links.incorpo1 || null);
      manejarElemento(document.getElementById("incorpo2"), data.links.incorpo2 || null);
    }

  } catch (error) {
    console.error("Error:", error);
    const bienvenidaElement = document.getElementById("bienvenida");
    if (bienvenidaElement) {
      bienvenidaElement.textContent = `Error: ${error.message}`;
      bienvenidaElement.style.color = "red";
    }
  }
});
