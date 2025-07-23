// En seguimiento.js
async function fetchData(distribuidor, categoria) {
  const loader = document.getElementById('loader');
  const errorDiv = document.getElementById('error-message');
  const tabla = document.getElementById('tabla-datos');
  
  try {
    loader.style.display = 'block';
    errorDiv.style.display = 'none';
    tabla.innerHTML = '';
    
    const url = `TU_URL_GAS?distribuidor=${encodeURIComponent(distribuidor)}&categoria=${encodeURIComponent(categoria)}`;
    console.log('URL de consulta:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error en la respuesta del servidor');
    }
    
    console.log('Datos recibidos:', data);
    
    if (data.rows.length === 0) {
      mostrarMensaje(`No se encontraron datos para ${distribuidor} en ${categoria}`);
      return;
    }
    
    renderData(data.rows);
    
  } catch (error) {
    console.error('Error al obtener datos:', error);
    mostrarError(`Error: ${error.message}`);
    
  } finally {
    loader.style.display = 'none';
  }
}

function mostrarMensaje(mensaje) {
  const tabla = document.getElementById('tabla-datos');
  tabla.innerHTML = `
    <tr>
      <td colspan="5" class="text-center py-4">
        <i class="fas fa-info-circle"></i> ${mensaje}
      </td>
    </tr>
  `;
}



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
