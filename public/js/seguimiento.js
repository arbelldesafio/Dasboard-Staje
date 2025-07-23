document.addEventListener("DOMContentLoaded", () => {
  const distribuidor = localStorage.getItem("distribuidor");
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (!distribuidor || !categoria) {
    alert("Sesión caducada o error de ruta. Volvé a iniciar sesión.");
    window.location.href = "./index.html";
    return;
  }

  fetch(`/api/links?distribuidor=${encodeURIComponent(distribuidor)}&categoria=${encodeURIComponent(categoria)}`)
    .then(res => res.json())
    .then(data => {
      console.log("🔍 Respuesta del backend:", data);

      if (!data.success || !data.rows || data.rows.length === 0) {
        alert("No se encontraron enlaces para mostrar.");
        return;
      }

      // Usamos la primera fila (la más relevante)
      const row = data.rows[0];

      // Bienvenida
      document.getElementById('bienvenida').textContent = `BIENVENIDO/A, DISTRIBUIDOR: ${row[3]}`;

      // Asignar los links a los botones (con fallback "#")
      document.getElementById('links-nuevas1').href = row[5] || "#";
      document.getElementById('links-nuevas2').href = row[6] || "#";
      document.getElementById('links-incorpo1').href = row[7] || "#";
      document.getElementById('links-incorpo2').href = row[9] || "#";
    })
    .catch(error => {
      console.error("❌ Error al obtener links:", error);
      alert("Error al cargar los enlaces filtrados.");
    });
});



// document.addEventListener("DOMContentLoaded", () => {
    //   const distribuidor = localStorage.getItem("distribuidor");
    //   if (!distribuidor) {
    //     alert("Sesión caducada. Volvé a iniciar sesión.");
    //     window.location.href = "./index.html";
    //     return;
    //   }

    //   fetch(`/api/links?distribuidor=${encodeURIComponent(distribuidor)}`)
    //     .then(res => res.json())
    //     .then(data => {
    //       console.log("Respuesta del backend:", data);

    //       if (!data.success || !data.rows || data.rows.length === 0) {
    //         alert("No se encontraron enlaces para mostrar.");
    //         return;
    //       }

    //       // Solo usamos la primera fila (filtrada por distribuidor)
    //       const row = data.rows[0];

    //       // Mostrar el nombre del distribuidor en la bienvenida

    //       // Asignar los links a los botones, con fallback si la celda está vacía
    //       document.getElementById('links-nuevas1').href = row[5] || "#";
    //       document.getElementById('links-nuevas2').href = row[6] || "#";
    //       document.getElementById('links-incorpo1').href = row[7] || "#";
    //       document.getElementById('links-incorpo2').href = row[9] || "#";
    //     })
    //     .catch(error => {
    //       console.error("Error al obtener links:", error);
    //       alert("Error al cargar los enlaces filtrados.");
    //     });
    // });
