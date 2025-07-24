function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}
button.addEventListener('click', debounce(() => {
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

    // 5. Función para manejar elementos
    const manejarElemento = (elemento, url) => {
      if (!elemento) return;
      
      if (url) {
        // Si tiene URL, lo habilitamos
        if (elemento.tagName === 'A') {
          elemento.href = url;
        }
        elemento.style.opacity = "1";
        elemento.style.cursor = "pointer";
        elemento.classList.remove('disabled');
      } else {
        // Si no tiene URL, lo deshabilitamos visualmente
        elemento.style.opacity = "0.6";
        elemento.style.cursor = "not-allowed";
        elemento.classList.add('disabled');
        
        // Comportamiento al hacer clic
        elemento.onclick = (e) => {
          e.preventDefault();
          return false;
        };
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
}));
