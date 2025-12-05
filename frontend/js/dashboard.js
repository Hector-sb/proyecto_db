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
      <p><strong>Límite de gastos:</strong> $${user.limite_gastos}</p>
      <button id="editLimiteBtn">Editar Límite de Gastos</button>
      
      <div id="editLimiteForm" style="display: none; margin-top: 20px;">
        <h3>Actualizar Límite de Gastos</h3>
        <form id="limiteForm">
          <label for="nuevoLimite">Nuevo límite ($):</label>
          <input type="number" id="nuevoLimite" step="0.01" min="0" value="${user.limite_gastos}" required>
          <button type="submit">Guardar</button>
          <button type="button" id="cancelEditBtn">Cancelar</button>
        </form>
        <div id="limiteMessage" style="margin-top: 10px;"></div>
      </div>
    </div>
  `;

  // Event listener para mostrar el formulario de edición
  document.getElementById("editLimiteBtn").addEventListener("click", () => {
    document.getElementById("editLimiteForm").style.display = "block";
    document.getElementById("editLimiteBtn").style.display = "none";
  });

  // Event listener para cancelar la edición
  document.getElementById("cancelEditBtn").addEventListener("click", () => {
    document.getElementById("editLimiteForm").style.display = "none";
    document.getElementById("editLimiteBtn").style.display = "block";
    document.getElementById("limiteMessage").innerHTML = "";
  });

  // Event listener para guardar el nuevo límite
  document.getElementById("limiteForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoLimite = parseFloat(document.getElementById("nuevoLimite").value);
    const messageDiv = document.getElementById("limiteMessage");

    try {
      const response = await fetch(`http://localhost:4000/usuarios/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: user.nombre,
          email: user.email,
          limite_gastos: nuevoLimite,
        }),
      });

      if (response.ok) {
        // Actualizar el objeto user y localStorage
        user.limite_gastos = nuevoLimite;
        localStorage.setItem("usuario", JSON.stringify(user));

        messageDiv.innerHTML = '<p style="color: green;">✓ Límite actualizado correctamente</p>';

        // Recargar la vista después de 1 segundo
        setTimeout(() => {
          renderHome();
        }, 1000);
      } else {
        messageDiv.innerHTML = '<p style="color: red;">✗ Error al actualizar el límite</p>';
      }
    } catch (error) {
      console.error("Error:", error);
      messageDiv.innerHTML = '<p style="color: red;">✗ Error de conexión con el servidor</p>';
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

