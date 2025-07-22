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

  const email = document.getElementById('email').value.trim();
  const contrasena = document.getElementById('password').value.trim();
  const mensaje = document.getElementById('mensaje');

const url = `/api/login?email=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(contrasena)}`;


  try {
    const response = await fetch(url);
    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // No es JSON válido, mostramos el texto recibido (puede ser HTML con error)
      mensaje.textContent = "Error: respuesta inesperada del servidor";
      mensaje.style.color = "red";
      console.error("Respuesta no JSON:", text);
      return;
    }

    if (result.success) {

    sessionStorage.setItem("distribuidor", data.distribuidor);
    sessionStorage.setItem("usuario", data.usuario);
    sessionStorage.setItem("email", data.email);

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
