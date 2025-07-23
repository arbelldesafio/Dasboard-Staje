document.addEventListener("DOMContentLoaded", () => {
  const distribuidor = localStorage.getItem("distribuidor");
  const categoria = new URLSearchParams(window.location.search).get("categoria") || "3y4";

  if (!distribuidor) {
    alert("Por favor inicie sesión nuevamente");
    window.location.href = "/index.html";
    return;
  }

  // Mostrar categoría en el título
  document.title = `SEGUIMIENTO - PERIODO ${categoria.toUpperCase()}`;

  // Función mejorada para manejar fetch
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/links?distribuidor=${encodeURIComponent(distribuidor)}&categoria=${encodeURIComponent(categoria)}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Error en los datos recibidos");
      }

      // Actualizar UI
      document.getElementById('bienvenida').textContent = `BIENVENIDO/A, DISTRIBUIDOR: ${data.distribuidor}`;

      // Función auxiliar para asignar links
      const assignLink = (id, url) => {
        const element = document.getElementById(id);
        if (element) {
          element.href = url || "#";
          if (!url) {
            element.classList.add("disabled-link");
            element.onclick = (e) => {
              e.preventDefault();
              alert("Este enlace no está disponible actualmente");
            };
          }
        }
      };

      // Asignar todos los links
      assignLink('links-nuevas1', data.links?.nuevas1);
      assignLink('links-nuevas2', data.links?.nuevas2);
      assignLink('links-incorpo1', data.links?.incorpo1);
      assignLink('links-incorpo2', data.links?.incorpo2);

    } catch (error) {
      console.error("Error al obtener datos:", error);
      document.getElementById('bienvenida').textContent = `Error: ${error.message}`;
      alert(`Error: ${error.message}`);
    }
  };

  // Ejecutar la función
  fetchData();
});
