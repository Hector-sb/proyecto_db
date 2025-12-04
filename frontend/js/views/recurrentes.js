export async function renderRecurrentes(containerId) {
    const container = document.getElementById(containerId);
    const user = JSON.parse(localStorage.getItem("usuario"));

    if (!user) return;

    container.innerHTML = `
    <h2>Pagos Recurrentes</h2>
    <form id="form-recurrente">
      <div class="form-group">
        <label>Descripción</label>
        <input type="text" id="desc" required />
      </div>
      <div class="form-group">
        <label>Monto</label>
        <input type="number" step="0.01" id="monto" required />
      </div>
      <div class="form-group">
        <label>Frecuencia</label>
        <select id="frecuencia">
          <option value="mensual">Mensual</option>
          <option value="semanal">Semanal</option>
          <option value="anual">Anual</option>
        </select>
      </div>
      <div class="form-group">
        <label>Próximo Pago</label>
        <input type="date" id="proximo" required />
      </div>
      <button type="submit">Agregar Pago Recurrente</button>
    </form>

    <h3>Listado de Pagos Recurrentes</h3>
    <table id="tabla-recurrentes">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Monto</th>
          <th>Frecuencia</th>
          <th>Próximo Pago</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

    await loadRecurrentes(user.id);

    document.getElementById("form-recurrente").addEventListener("submit", async (e) => {
        e.preventDefault();
        const desc = document.getElementById("desc").value;
        const monto = document.getElementById("monto").value;
        const frecuencia = document.getElementById("frecuencia").value;
        const proximo = document.getElementById("proximo").value;

        try {
            const res = await fetch("http://localhost:4000/recurrentes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    descripcion: desc,
                    monto,
                    frecuencia_pago: frecuencia,
                    proximo_pago: proximo,
                    id_usuario: user.id
                })
            });

            if (res.ok) {
                alert("Pago recurrente agregado");
                e.target.reset();
                loadRecurrentes(user.id);
            } else {
                alert("Error al agregar pago recurrente");
            }
        } catch (err) {
            console.error(err);
        }
    });
}

async function loadRecurrentes(userId) {
    try {
        const res = await fetch(`http://localhost:4000/recurrentes/usuario/${userId}`);
        const data = await res.json();
        const tbody = document.querySelector("#tabla-recurrentes tbody");
        tbody.innerHTML = "";

        data.forEach(r => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${r.descripcion}</td>
        <td>$${r.monto}</td>
        <td>${r.frecuencia_pago}</td>
        <td>${new Date(r.proximo_pago).toLocaleDateString()}</td>
        <td>
          <button class="delete-btn" data-id="${r.id}">Eliminar</button>
        </td>
      `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                if (!confirm("¿Seguro de eliminar?")) return;
                const id = e.target.getAttribute("data-id");
                await fetch(`http://localhost:4000/recurrentes/${id}`, { method: "DELETE" });
                loadRecurrentes(userId);
            });
        });

    } catch (err) {
        console.error(err);
    }
}
