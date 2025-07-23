document.addEventListener("DOMContentLoaded", () => {
  const distribuidor = localStorage.getItem("distribuidor");
  const categoria = localStorage.getItem("categoria") || "3y4";

  if (!distribuidor) {
    alert("Sesión caducada. Volvé a iniciar sesión.");
    window.location.href = "./index.html";
    return;
  }

  // Actualizar título
  document.title = `SEGUIMIENTO - PERIODO ${categoria.toUpperCase()}`;

  // Usar URL relativa si el frontend y backend están en el mismo dominio
  fetch(`/api/links?distribuidor=${encodeURIComponent(distribuidor)}&categoria=${encodeURIComponent(categoria)}`)
    .then(async res => {
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al obtener datos");
      }
      return res.json();
    })
    .then(data => {
      if (!data.success) throw new Error(data.message || "Error en los datos");

      // Mostrar bienvenida
      document.getElementById('bienvenida').textContent = 
        `BIENVENIDO/A, DISTRIBUIDOR: ${data.distribuidor}`;

      // Función para asignar links con validación
      const assignLink = (elementId, url) => {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (url) {
          element.href = url;
          element.classList.remove("disabled-link");
        } else {
          element.href = "#";
          element.classList.add("disabled-link");
          element.onclick = (e) => {
            e.preventDefault();
            alert("Este link no está disponible actualmente");
          };
        }
      };

      // Asignar links
      assignLink('links-nuevas1', data.links.nuevas1);
      assignLink('links-nuevas2', data.links.nuevas2);
      assignLink('links-incorpo1', data.links.incorpo1);
      assignLink('links-incorpo2', data.links.incorpo2);
    })
    .catch(error => {
      console.error("Error:", error);
      document.getElementById('bienvenida').textContent = `ERROR: ${error.message}`;
    });
});
