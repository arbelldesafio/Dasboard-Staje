document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = encodeURIComponent(document.getElementById('email').value.trim());
  const contrasena = encodeURIComponent(document.getElementById('password').value.trim());
  const mensaje = document.getElementById('mensaje');

const url = `/api/login?email=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(contrasena)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

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

