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

    // Validación de respuesta
    if (!data?.success || !data?.links) {
      throw new Error(data?.error || "Estructura de datos incorrecta");
    }

    // Función para verificar valores no válidos
    const esValorInvalido = (valor) => {
      return valor === '#N/A' || valor === 0 || valor === '' || valor === null || valor === undefined;
    };

    // 5. Función mejorada para manejar elementos
    const manejarElemento = (elemento, valor) => {
      if (!elemento) return;
      
      // Clonar para limpiar eventos anteriores
      const nuevoElemento = elemento.cloneNode(true);
      elemento.replaceWith(nuevoElemento);
      
      if (esValorInvalido(valor)) {
        // Deshabilitar si el valor es inválido
        nuevoElemento.style.opacity = "0.6";
        nuevoElemento.style.cursor = "not-allowed";
        nuevoElemento.classList.add('disabled');
        nuevoElemento.onclick = (e) => e.preventDefault();
      } else {
        // Habilitar si el valor es válido
        if (nuevoElemento.tagName === 'A') {
          nuevoElemento.href = valor;
        }
        nuevoElemento.style.opacity = "1";
        nuevoElemento.style.cursor = "pointer";
        nuevoElemento.classList.remove('disabled');
        
        // Agregar feedback al hacer clic
        nuevoElemento.addEventListener('click', () => {
          nuevoElemento.classList.add('loading');
          setTimeout(() => nuevoElemento.classList.remove('loading'), 1000);
        });
      }
    };

    // Aplicar a todos los elementos
    manejarElemento(document.getElementById("nuevas1"), data.links.nuevas1);
    manejarElemento(document.getElementById("nuevas2"), data.links.nuevas2);
    manejarElemento(document.getElementById("incorpo1"), data.links.incorpo1);
    manejarElemento(document.getElementById("incorpo2"), data.links.incorpo2);

  } catch (error) {
    console.error("Error:", error);
    const bienvenidaElement = document.getElementById("bienvenida");
    if (bienvenidaElement) {
      bienvenidaElement.textContent = `Error: ${error.message}`;
      bienvenidaElement.style.color = "red";
    }
  }
});
