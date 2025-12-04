export async function renderIngresos(containerId) {
    const container = document.getElementById(containerId);
    const user = JSON.parse(localStorage.getItem("usuario"));

    if (!user) return;

    container.innerHTML = `
    <h2>Ingresos</h2>
    <form id="form-ingreso">
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
      <button type="submit">Agregar Ingreso</button>
    </form>

    <h3>Historial de Ingresos</h3>
    <table id="tabla-ingresos">
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  `;

    await loadIngresos(user.id);

    document.getElementById("form-ingreso").addEventListener("submit", async (e) => {
        e.preventDefault();
        const desc = document.getElementById("desc").value;
        const monto = document.getElementById("monto").value;
        const fecha = document.getElementById("fecha").value;

        try {
            const res = await fetch("http://localhost:4000/ingresos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    descripcion: desc,
                    monto,
                    fecha,
                    id_usuario: user.id
                })
            });

            if (res.ok) {
                alert("Ingreso agregado");
                e.target.reset();
                loadIngresos(user.id);
            } else {
                alert("Error al agregar ingreso");
            }
        } catch (err) {
            console.error(err);
        }
    });
}

async function loadIngresos(userId) {
    try {
        const res = await fetch(`http://localhost:4000/ingresos/usuario/${userId}`);
        const data = await res.json();
        const tbody = document.querySelector("#tabla-ingresos tbody");
        tbody.innerHTML = "";

        data.forEach(i => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${i.descripcion}</td>
        <td>$${i.monto}</td>
        <td>${new Date(i.fecha).toLocaleDateString()}</td>
        <td>
          <button class="delete-btn" data-id="${i.id}">Eliminar</button>
        </td>
      `;
            tbody.appendChild(tr);
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                if (!confirm("¿Seguro de eliminar?")) return;
                const id = e.target.getAttribute("data-id");
                await fetch(`http://localhost:4000/ingresos/${id}`, { method: "DELETE" });
                loadIngresos(userId);
            });
        });

    } catch (err) {
        console.error(err);
    }
}
