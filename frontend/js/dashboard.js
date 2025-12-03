const user = JSON.parse(localStorage.getItem("usuario"));

if (!user) {
  window.location.href = "login.html";
}

document.getElementById("userInfo").innerHTML = `
  <p><strong>Nombre:</strong> ${user.nombre}</p>
  <p><strong>Email:</strong> ${user.email}</p>
  <p><strong>Límite de gastos:</strong> $${user.limite_gastos}</p>
`;

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
});
