// document.getElementById('loginForm').addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const email = encodeURIComponent(document.getElementById('email').value.trim());
//   const contrasena = encodeURIComponent(document.getElementById('password').value.trim());
//   const mensaje = document.getElementById('mensaje');
  
// const url = `/api/login?email=${email}&contrasena=${contrasena}`;

//   try {
//     const response = await fetch(url);
//     const result = await response.json();

//     if (result.success) {
//       mensaje.textContent = `Bienvenido, ${result.distribuidor || result.email}!`;
//       mensaje.style.color = "lightgreen";

//       setTimeout(() => {
//         window.location.href = "./dashboard.html";
//       }, 1500);
//     } else {
//       mensaje.textContent = result.message || "Credenciales incorrectas.";
//       mensaje.style.color = "yellow";
//     }
//   } catch (error) {
//     mensaje.textContent = "Error al conectar con el servidor.";
//     mensaje.style.color = "red";
//     console.error("Error:", error);
//   }
// });

document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = encodeURIComponent(document.getElementById('email').value.trim());
  const contrasena = encodeURIComponent(document.getElementById('password').value.trim());
  const mensaje = document.getElementById('mensaje');

  const url = `/api/login?email=${email}&contrasena=${contrasena}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      sessionStorage.setItem("distribuidor", result.distribuidor);
      sessionStorage.setItem("usuario", result.usuario);
      sessionStorage.setItem("email", result.email);

      mensaje.textContent = `Bienvenido, ${result.distribuidor}!`;
      mensaje.style.color = "lightgreen";

      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 1500);
    } else {
      mensaje.textContent = result.message || "Credenciales incorrectas.";
      mensaje.style.color = "red";
    }
  } catch (error) {
    mensaje.textContent = "Error al conectar con el servidor.";
    mensaje.style.color = "red";
    console.error("Error:", error);
  }
});

