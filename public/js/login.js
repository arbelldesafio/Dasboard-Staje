document.getElementById('togglePassword').addEventListener('click', function () {
  const passwordInput = document.getElementById('password');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);

  // Cambia el ícono opcionalmente
  this.textContent = type === 'password' ? '👁️' : '🙈';
});


document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const contrasena = document.getElementById('password').value.trim();
  const mensaje = document.getElementById('mensaje');

  const url = `/api/login?email=${encodeURIComponent(email)}&contrasena=${encodeURIComponent(contrasena)}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      localStorage.setItem("distribuidor", result.distribuidor);
      localStorage.setItem("usuario", result.usuario);
      localStorage.setItem("email", result.email);

      mensaje.textContent = `BIENVENIDO/A, ${result.distribuidor}!`;
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
