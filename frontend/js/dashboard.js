import { renderGastos } from "./views/gastos.js";
import { renderIngresos } from "./views/ingresos.js";
import { renderRecurrentes } from "./views/recurrentes.js";

const user = JSON.parse(localStorage.getItem("usuario"));

if (!user) {
  window.location.href = "login.html";
}

// Elementos del DOM
const contentDiv = "content"; // ID del contenedor principal

// Función para renderizar el inicio
function renderHome() {
  const container = document.getElementById(contentDiv);
  container.innerHTML = `
    <h2>Bienvenido, ${user.nombre}</h2>
    <div id="userInfo">
      <p><strong>Email:</strong> ${user.email}</p>
      <div style="margin-top: 10px;">
        <label for="limiteGastosInput"><strong>Límite de gastos:</strong> $</label>
        <input type="number" id="limiteGastosInput" value="${user.limite_gastos}" style="width: 100px; padding: 5px;">
        <button id="btnUpdateLimit" style="padding: 5px 10px; cursor: pointer;">Actualizar</button>
      </div>
    </div>
  `;

  // Event listener para el botón de actualizar
  document.getElementById("btnUpdateLimit").addEventListener("click", async () => {
    const newLimit = document.getElementById("limiteGastosInput").value;

    try {
      const res = await fetch(`http://localhost:4000/usuarios/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: user.nombre,
          email: user.email,
          limite_gastos: newLimit
        }),
      });

      if (res.ok) {
        // Actualizar local storage
        user.limite_gastos = newLimit;
        localStorage.setItem("usuario", JSON.stringify(user));
        alert("Límite de gastos actualizado correctamente");
      } else {
        const data = await res.json();
        alert("Error al actualizar: " + (data.error || "Desconocido"));
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al actualizar");
    }
  });
}

// Event Listeners para el menú
document.getElementById("nav-home").addEventListener("click", (e) => {
  e.preventDefault();
  renderHome();
});

document.getElementById("nav-gastos").addEventListener("click", (e) => {
  e.preventDefault();
  renderGastos(contentDiv);
});

document.getElementById("nav-ingresos").addEventListener("click", (e) => {
  e.preventDefault();
  renderIngresos(contentDiv);
});

document.getElementById("nav-recurrentes").addEventListener("click", (e) => {
  e.preventDefault();
  renderRecurrentes(contentDiv);
});

document.getElementById("logout").addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("usuario");
  window.location.href = "login.html";
});

// Cargar inicio por defecto
renderHome();

