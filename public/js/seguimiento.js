document.addEventListener("DOMContentLoaded", () => {
  const distribuidor = localStorage.getItem("distribuidor");
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria") || localStorage.getItem("categoria") || "3y4";

  if (!distribuidor || !categoria) {
    alert("Sesión caducada o error de ruta. Volvé a iniciar sesión.");
    window.location.href = "./index.html";
    return;
  }

  // Mostrar categoría en el título
  document.title = `SEGUIMIENTO - PERIODO ${categoria.toUpperCase()}`;
  
  fetch(`/api/links?distribuidor=${encodeURIComponent(distribuidor)}&categoria=${encodeURIComponent(categoria)}`)
    .then(res => {
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      if (!data.success) {
        throw new Error(data.message || "Error al obtener datos");
      }

      // Bienvenida
      document.getElementById('bienvenida').textContent = `BIENVENIDO/A, DISTRIBUIDOR: ${data.distribuidor}`;

      // Asignar links con validación
      const assignLink = (id, url) => {
        const element = document.getElementById(id);
        if (element) {
          element.href = url || "#";
          if (!url) {
            element.style.opacity = "0.5";
            element.style.cursor = "not-allowed";
            element.onclick = (e) => e.preventDefault();
          }
        }
      };

      assignLink('links-nuevas1', data.links?.nuevas1);
      assignLink('links-nuevas2', data.links?.nuevas2);
      assignLink('links-incorpo1', data.links?.incorpo1);
      assignLink('links-incorpo2', data.links?.incorpo2);

    })
    .catch(error => {
      console.error("❌ Error al obtener links:", error);
      alert(`Error: ${error.message}`);
      document.getElementById('bienvenida').textContent = `ERROR: ${error.message}`;
    });
});
