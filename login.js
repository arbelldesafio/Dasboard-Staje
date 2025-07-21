document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = encodeURIComponent(document.getElementById('email').value.trim());
  const contrasena = encodeURIComponent(document.getElementById('password').value.trim());
  const mensaje = document.getElementById('mensaje');

  const url = `https://script.google.com/macros/s/AKfycbzbJafkw2LaCDqYHKT31cB-TMVAh01AZdWshjTY3GifFftY6BeA1nrQ7YN3ra_8jA2I/exec?email=${email}&contrasena=${contrasena}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      mensaje.textContent = `Bienvenido, ${result.nombre}!`;
      mensaje.style.color = "lightgreen";

      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 1500);
    } else {
      mensaje.textContent = result.message || "Credenciales incorrectas.";
      mensaje.style.color = "yellow";
    }
  } catch (error) {
    mensaje.textContent = "Error al conectar con el servidor.";
    mensaje.style.color = "red";
    console.error("Error:", error);
  }
});




//  async function validarLogin(event) {
//     event.preventDefault();

//     const email = encodeURIComponent(document.getElementById('email').value.trim());
//     const contrasena = encodeURIComponent(document.getElementById('password').value.trim());
//     const mensaje = document.getElementById('mensaje');

//     // URL del Web App con email y contraseña como parámetros
//     const url = `https://script.google.com/macros/s/AKfycbzQ4g9EJUUZyNbCxNlKhl3hiToNM-mA2K84ky38thmjWgpXP94-ySwpvAWU6JbPXUv9/exec?email=${email}&contrasena=${contrasena}`;

//     try {
//       const response = await fetch(url);
//       const result = await response.json();

//       if (result.success) {
//         mensaje.textContent = `Bienvenido, ${result.nombre}!`;
//         mensaje.style.color = "green";

//         // Redirigir al dashboard luego de 1.5 segundos
//         setTimeout(() => {
//           window.location.href = "./dashboard.html";
//         }, 1500);
//       } else {
//         mensaje.textContent = "Credenciales incorrectas.";
//         mensaje.style.color = "red";
//       }
//     } catch (error) {
//       console.error("Error de red:", error);
//       mensaje.textContent = "Error al conectar con el servidor.";
//       mensaje.style.color = "orange";
//     }

//     return false;
//   }
