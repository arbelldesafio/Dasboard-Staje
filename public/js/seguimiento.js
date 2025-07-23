document.addEventListener("DOMContentLoaded", () => {
  const distribuidor = localStorage.getItem("distribuidor");

  if (!distribuidor) {
    alert("Sesión caducada. Volvé a iniciar sesión.");
    window.location.href = "./index.html";
    return;
  }

  fetch(`/api/links?distribuidor=${encodeURIComponent(distribuidor)}`)
    .then(res => res.json())
    .then(data => {
      console.log("🔍 Respuesta del backend:", data);

      if (!data.success || !data.rows || data.rows.length === 0) {
        alert("No se encontraron enlaces para mostrar.");
        return;
      }

      const row = data.rows[0];

      // Mostrar bienvenida
      document.getElementById('bienvenida').textContent = `BIENVENIDO/A, DISTRIBUIDOR: ${row[3]}`;

      // Asignar enlaces
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
