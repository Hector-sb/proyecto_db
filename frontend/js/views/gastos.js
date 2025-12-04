export async function renderGastos(containerId) {
    const container = document.getElementById(containerId);
    const user = JSON.parse(localStorage.getItem("usuario"));

    if (!user) return;

    container.innerHTML = `
    <h2>Gastos</h2>
    <form id="form-gasto">
      <div class="form-group">
        <label>Descripción</label>
        <input type="text" id="desc" required />
      </div>
      <div class="form-group">
        <label>Monto</label>
        <input type="number" step="0.01" id="monto" required />
      </div>
      <div class="form-group">
        <label>Fecha</label>
        <input type="date" id="fecha" required />
      </div>
      <div class="form-group">
        <label>Categoría</label>
        <input type="text" id="categoria" />
      </div>
      <button type="submit">Agregar Gasto</button>
    </form>

    <h3>Historial de Gastos</h3>
    <table id="tabla-gastos">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

    // Cargar gastos
    await loadGastos(user.id);

    // Manejar submit
    document.getElementById("form-gasto").addEventListener("submit", async (e) => {
        e.preventDefault();
        const desc = document.getElementById("desc").value;
        const monto = document.getElementById("monto").value;
        const fecha = document.getElementById("fecha").value;
        const categoria = document.getElementById("categoria").value;

        try {
            const res = await fetch("http://localhost:4000/gastos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    descripcion: desc,
                    monto,
                    fecha,
                    categoria,
                    id_usuario: user.id
                })
            });

            if (res.ok) {
                alert("Gasto agregado");
                e.target.reset();
                loadGastos(user.id);
            } else {
                alert("Error al agregar gasto");
            }
        } catch (err) {
            console.error(err);
        }
    });
}

async function loadGastos(userId) {
    try {
        const res = await fetch(`http://localhost:4000/gastos/usuario/${userId}`);
        const data = await res.json();
        const tbody = document.querySelector("#tabla-gastos tbody");
        tbody.innerHTML = "";

        data.forEach(g => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${g.descripcion}</td>
        <td>$${g.monto}</td>
        <td>${new Date(g.fecha).toLocaleDateString()}</td>
        <td>${g.categoria || '-'}</td>
        <td>
          <button class="delete-btn" data-id="${g.id}">Eliminar</button>
        </td>
      `;
            tbody.appendChild(tr);
        });

        // Listeners para eliminar
        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                if (!confirm("¿Seguro de eliminar?")) return;
                const id = e.target.getAttribute("data-id");
                await fetch(`http://localhost:4000/gastos/${id}`, { method: "DELETE" });
                loadGastos(userId);
            });
        });

    } catch (err) {
        console.error(err);
    }
}
