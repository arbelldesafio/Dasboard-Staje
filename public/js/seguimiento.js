document.addEventListener("DOMContentLoaded", async () => {
  // Elementos UI
  const bienvenidaElement = document.getElementById("bienvenida");
  const statusElement = document.createElement('p');
  statusElement.id = 'status-info';
  statusElement.style.margin = '10px 0';
  statusElement.style.fontStyle = 'italic';
  document.querySelector('.seccion').prepend(statusElement);
  
  // Mostrar estado inicial
  updateStatus("Cargando datos del distribuidor...", 'loading');

  try {
    // 1. Determinar categoría
    const urlActual = window.location.pathname;
    const categoria = urlActual.includes('4y5') ? '4y5' : '3y4';
    
    // 2. Obtener distribuidor
    const distribuidor = localStorage.getItem("distribuidor");
    if (!distribuidor) throw new Error("Distribuidor no encontrado en localStorage");
    const distribuidorNormalizado = distribuidor.toUpperCase();
    bienvenidaElement.textContent = `Distribuidor: ${distribuidorNormalizado}`;
    updateStatus("Conectando con el servidor...", 'loading');

    // 3. Configurar endpoints
    const endpoints = {
      "3y4": "https://script.google.com/macros/s/AKfycbzjy5b7r7acFEwTGBI7H03AVU21PPfraUZmnQhe7Hmv5H0WrL3ifLR1ntbUGhswACCE/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbybt1ksWrH2XgwbcahxVZs6JNDope_2jO9EYlxtxYkqNXHqzAq0HRBd7mEHtqfhEMlLxQ/exec"
    };

    const endpoint = endpoints[categoria];
    if (!endpoint) throw new Error("Endpoint no configurado para esta categoría");

    // 4. Obtener datos de la API
    updateStatus("Obteniendo enlaces...", 'loading');
    const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) throw new Error(`Error en la conexión: ${response.status}`);
    
    const data = await response.json();
    console.log("Datos recibidos:", data);
    
    if (!data.success) throw new Error(data.error || "Error en los datos recibidos");

    // 5. Asignar enlaces
    updateStatus("Preparando enlaces...", 'loading');
    const links = data.links || data;
    asignarEnlaces(links);

    // 6. Informar que todo está listo
    updateStatus("Información cargada correctamente", 'success');
    setTimeout(() => {
      statusElement.style.display = 'none';
    }, 3000);

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
  const statusElement = document.getElementById('status-info');
  if (!statusElement) return;
  
  statusElement.textContent = message;
  statusElement.style.color = 
    type === 'error' ? '#d32f2f' : 
    type === 'success' ? '#388e3c' : 
    '#1976d2';
}

// Función para asignar enlaces
function asignarEnlaces(links) {
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

  asignarEnlace("nuevas1", links.nuevas1);
  asignarEnlace("nuevas2", links.nuevas2);
  asignarEnlace("incorpo1", links.incorpo1);
  asignarEnlace("incorpo2", links.incorpo2);
}
