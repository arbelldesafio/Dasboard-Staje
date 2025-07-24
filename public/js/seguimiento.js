document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1. Obtener y validar categoría
    const urlActual = window.location.pathname;
    const categoria = urlActual.includes('4y5') ? '4y5' : 
                     urlActual.includes('3y4') ? '3y4' : null;
    
    if (!categoria) throw new Error("URL debe contener '3y4' o '4y5'");

    // 2. Obtener y validar distribuidor
    const distribuidor = localStorage.getItem("distribuidor");
    if (!distribuidor) throw new Error("Distribuidor no encontrado");
    const distribuidorNormalizado = distribuidor.toUpperCase();
    document.getElementById("bienvenida").textContent = `Distribuidor: ${distribuidorNormalizado}`;

    // 3. Configurar endpoint
    const endpoints = {
      "3y4": "https://script.google.com/macros/s/AKfycbwKBVGe_QZrvgXt0g0ayY3rbWMW8ekYojdii-r3oRCB90UqhJvQdDhCf3jlLOP0IRHb/exec",
      "4y5": "https://script.google.com/macros/s/AKfycbxqJuHmvFxoX6FOeIZMmLo1taBBVrBJtZZ_H9S265HXLsy00dD38bJivkJMyKcw7VyzEA/exec"
    };
    const endpoint = endpoints[categoria];
    if (!endpoint) throw new Error(`Endpoint no configurado para ${categoria}`);

    // 4. Obtener datos de la API con validación
    const apiUrl = `${endpoint}?distribuidor=${encodeURIComponent(distribuidorNormalizado)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
    
    const data = await response.json();
    if (!data.success) throw new Error(data.error || "Error en API");
    
    // 5. Validar estructura de datos recibida
    if (!data.links || typeof data.links !== 'object') {
      throw new Error("Formato de datos incorrecto: falta objeto 'links'");
    }

    // 6. Asignar enlaces con validación
    const asignarEnlaceSeguro = (id, url) => {
      if (!url) {
        console.warn(`URL no definida para ${id}`);
        return;
      }
      const elemento = document.getElementById(id);
      if (elemento) elemento.href = url;
      else console.warn(`Elemento ${id} no encontrado`);
    };

    // Usando los nombres exactos de las propiedades que devuelve la API
    asignarEnlaceSeguro("links-nuevas1", data.links.nuevas1);
    asignarEnlaceSeguro("links-nuevas2", data.links.nuevas2);
    asignarEnlaceSeguro("links-incorpo1", data.links.incorpo1);
    asignarEnlaceSeguro("links-incorpo2", data.links.incorpo2);

    console.log("Enlaces asignados correctamente");

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("bienvenida").textContent = `Error: ${error.message}`;
    document.getElementById("bienvenida").style.color = "red";
    
    // Crear botón de reintento
    const boton = document.createElement("button");
    boton.textContent = "Reintentar";
    boton.className = "boton-link";
    boton.onclick = () => window.location.reload();
    document.querySelector(".seccion").appendChild(boton);
  }
});
