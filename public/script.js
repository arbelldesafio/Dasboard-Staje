function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const dni = document.getElementById("dni").value.trim();
  const mensaje = document.getElementById("mensaje");

  if (!email || !dni) {
    mensaje.textContent = "Por favor, complete ambos campos.";
    return;
  }

  const url = `https://script.google.com/macros/s/TU_ID_WEBAPP/exec?email=${email}&dni=${dni}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data === "null") {
        mensaje.textContent = "Credenciales incorrectas.";
        return;
      }

      localStorage.setItem("usuario", JSON.stringify(data));

      // Redirigir al archivo de período
      window.location.href = "periodo3y4.html";"periodo4y5.html" // Ajustá según tu diseño
    })
    .catch(error => {
      console.error("Error:", error);
      mensaje.textContent = "Error de conexión.";
    });
}
