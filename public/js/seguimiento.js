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

    // 4. Obtener datos de la API (con reintento automático)
    let data;
    let intentos = 0;
    const maxIntentos = 2;
    
    while (intentos < maxIntentos) {
      try {
        const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        data = await response.json();
        console.log("Datos recibidos:", data);

        if (!data.success) throw new Error(data.error || "Error en la API");
        break; // Salir del bucle si todo está bien
      } catch (error) {
        intentos++;
        if (intentos >= maxIntentos) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo antes de reintentar
      }
    }

    // 5. Función mejorada para asignar enlaces
    const asignarEnlace = (id, url) => {
      const elemento = document.getElementById(id);
      if (!elemento) {
        console.warn(`Elemento ${id} no encontrado`);
        return;
      }
      
      // Solo deshabilitar si es un botón sin enlace
      if (elemento.tagName === 'BUTTON' && !url) {
        elemento.disabled = true;
        elemento.style.opacity = "0.6";
        elemento.style.cursor = "not-allowed";
        elemento.title = "Opción no disponible";
      } else if (elemento.tagName === 'A') {
        if (url) {
          elemento.href = url;
          elemento.style.opacity = "1";
          elemento.style.cursor = "pointer";
        } else {
          elemento.style.opacity = "0.6";
          elemento.style.cursor = "not-allowed";
          elemento.onclick = (e) => {
            e.preventDefault();
            alert("Esta opción no está disponible actualmente");
          };
          elemento.title = "Enlace no disponible";
        }
      }
    };

    // Asignación de enlaces
    asignarEnlace("nuevas1", data.links.nuevas1);
    asignarEnlace("nuevas2", data.links.nuevas2);
    asignarEnlace("incorpo1", data.links.incorpo1);
    asignarEnlace("incorpo2", data.links.incorpo2);

    // Solución para el bug de doble clic
    document.querySelectorAll('a, button').forEach(elemento => {
      elemento.addEventListener('click', function(e) {
        if (this.disabled || this.style.cursor === 'not-allowed') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        
        // Agregar clase de carga temporal
        this.classList.add('loading');
        setTimeout(() => this.classList.remove('loading'), 1000);
      }, { once: true }); // El evento se ejecuta solo una vez
    });

  } catch (error) {
    console.error("Error:", error);
    const bienvenidaElement = document.getElementById("bienvenida");
    if (bienvenidaElement) {
      bienvenidaElement.textContent = `Error: ${error.message}`;
      bienvenidaElement.style.color = "red";
    }
    
    // Botón de reintento mejorado
    const boton = document.createElement("button");
    boton.textContent = "Reintentar";
    boton.className = "boton-link";
    boton.onclick = () => {
      boton.textContent = "Cargando...";
      boton.disabled = true;
      window.location.reload();
    };
    
    const seccion = document.querySelector(".seccion");
    if (seccion) {
      // Limpiar botones anteriores
      const botonesAnteriores = seccion.querySelectorAll('button.boton-link');
      botonesAnteriores.forEach(b => b.remove());
      
      seccion.appendChild(boton);
    }
  }
});
