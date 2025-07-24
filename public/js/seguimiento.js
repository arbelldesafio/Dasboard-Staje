document.addEventListener("DOMContentLoaded", async () => {
  // Elementos UI
  const bienvenidaElement = document.getElementById("bienvenida");
  const statusElement = document.createElement('div');
  statusElement.id = 'status-message';
  statusElement.style.margin = '10px 0';
  statusElement.style.padding = '10px';
  statusElement.style.borderRadius = '4px';
  statusElement.style.backgroundColor = '#f5f5f5';
  document.querySelector('.seccion').prepend(statusElement);

  try {
    // 1. Estado inicial
    updateStatus("Iniciando carga de datos...", 'loading');
    bienvenidaElement.textContent = "Cargando datos del distribuidor...";

    // 2. Determinar categoría
    const urlActual = window.location.pathname;
    const categoria = urlActual.includes('4y5') ? '4y5' : '3y4';
    updateStatus(`Configurando para categoría: ${categoria.toUpperCase()}`, 'loading');

    // 3. Obtener distribuidor
    const distribuidor = localStorage.getItem("distribuidor");
    if (!distribuidor) throw new Error("Distribuidor no encontrado en localStorage");
    const distribuidorNormalizado = distribuidor.toUpperCase();
    bienvenidaElement.textContent = `Distribuidor: ${distribuidorNormalizado}`;

    // 4. Configurar endpoints
    const endpoints = {
      "3y4": "https://script.google.com/macros/s/AKfycbyfTM29T0R7VwlGfuEqJhZflkA4TuB1uzIN0eGv2BFu2SgLjFDhkzmXhmDyQMq4l1EGyA/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbwbtC3kvYWtaXSdC6jP16CrAAde7IqXTuJgb_M-FfO1RReG9AVV9cbJvSCcFCc5E1ko/exec"
    };

    const endpoint = endpoints[categoria];
    if (!endpoint) throw new Error("Endpoint no configurado");

    // 5. Obtener datos de la API
    updateStatus("Obteniendo información del servidor...", 'loading');
    const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error(`Error en la conexión: ${response.status}`);
    
    const data = await response.json();
    console.log("Datos recibidos:", data);
    
    if (!data.success) throw new Error(data.error || "Error en la respuesta del servidor");

    // 6. Procesar enlaces
    updateStatus("Procesando enlaces disponibles...", 'loading');
    const links = data.links || data;
    
    // Asignación mejorada de enlaces
    const resultados = asignarEnlacesMejorado({
      nuevas1: links.nuevas1,
      nuevas2: links.nuevas2,
      incorpo1: links.incorpo1,
      incorpo2: links.incorpo2
    });

    // 7. Mostrar resumen
    const mensajeFinal = `Carga completada: ${resultados.disponibles} enlaces disponibles, ${resultados.noDisponibles} no disponibles`;
    updateStatus(mensajeFinal, 'success');
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
      statusElement.style.opacity = '0';
      setTimeout(() => statusElement.remove(), 500);
    }, 5000);

  } catch (error) {
    console.error("Error:", error);
    updateStatus(`Error: ${error.message}`, 'error');
    
    // Botón de reintento
    const boton = document.createElement("button");
    boton.textContent = "Reintentar";
    boton.className = "boton-link";
    boton.onclick = () => window.location.reload();
    document.querySelector(".seccion").appendChild(boton);
  }
});

// Función para actualizar el estado
function updateStatus(message, type) {
  const statusElement = document.getElementById('status-message');
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.style.color = 
    type === 'error' ? '#d32f2f' : 
    type === 'success' ? '#388e3c' : 
    '#1976d2';
  statusElement.style.backgroundColor = 
    type === 'error' ? '#ffebee' : 
    type === 'success' ? '#e8f5e9' : 
    '#e3f2fd';
}

// Función mejorada para asignar enlaces
function asignarEnlacesMejorado(links) {
  const resultados = {
    disponibles: 0,
    noDisponibles: 0
  };

  const asignarEnlace = (id, url) => {
    const elemento = document.getElementById(id);
    if (!elemento) {
      console.warn(`Elemento ${id} no encontrado`);
      return false;
    }
    
    if (!url || !url.startsWith('http')) {
      elemento.style.opacity = "0.6";
      elemento.style.cursor = "not-allowed";
      elemento.onclick = (e) => e.preventDefault();
      elemento.title = "Enlace no disponible";
      resultados.noDisponibles++;
      return false;
    }
    
    elemento.href = url;
    elemento.style.opacity = "1";
    elemento.style.cursor = "pointer";
    resultados.disponibles++;
    return true;
  };

  // Asignar todos los enlaces
  asignarEnlace("nuevas1", links.nuevas1);
  asignarEnlace("nuevas2", links.nuevas2);
  asignarEnlace("incorpo1", links.incorpo1);
  asignarEnlace("incorpo2", links.incorpo2);

  return resultados;
}
