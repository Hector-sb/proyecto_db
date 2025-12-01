const API_URL = 'http://localhost:3000/api';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

// --- USERS ---
async function loadUsers() {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();
    const list = document.getElementById('users-list');
    const select = document.getElementById('user-select');

    list.innerHTML = '';
    select.innerHTML = '<option value="">Seleccionar Usuario</option>';

    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${user.nombre}</strong>
                <div style="font-size: 0.8rem; color: #666;">${user.email}</div>
            </div>
            <span class="badge">Límite: ${formatCurrency(user.limite_gastos_global)}</span>
        `;
        list.appendChild(div);

        const option = document.createElement('option');
        option.value = user.id_usuario;
        option.textContent = user.nombre;
        select.appendChild(option);
    });
}

document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const limite = document.getElementById('limite').value;

    await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, limite_gastos_global: limite })
    });

    e.target.reset();
    loadUsers();
});

// --- HELPER: Load Accounts & Categories when User Selected ---
document.getElementById('user-select').addEventListener('change', async (e) => {
    const userId = e.target.value;
    if (!userId) return;

    // Load Accounts
    const resAcc = await fetch(`${API_URL}/cuentas?id_usuario=${userId}`);
    const accounts = await resAcc.json();
    const accSelect = document.getElementById('account-select');
    accSelect.innerHTML = '<option value="">Seleccionar Cuenta</option>';
    accounts.forEach(acc => {
        const opt = document.createElement('option');
        opt.value = acc.id_cuenta;
        opt.textContent = `${acc.nombre} (${formatCurrency(acc.saldo_inicial)})`;
        accSelect.appendChild(opt);
    });

    // Load Categories (Gasto)
    const resCat = await fetch(`${API_URL}/categorias?id_usuario=${userId}&tipo=Gasto`);
    const categories = await resCat.json();
    const catSelect = document.getElementById('cat-gasto');
    catSelect.innerHTML = '<option value="">Seleccionar Categoría</option>';
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id_categoria;
        opt.textContent = cat.nombre;
        catSelect.appendChild(opt);
    });
});

// --- EXPENSES ---
async function loadExpenses() {
    const res = await fetch(`${API_URL}/gastos`);
    const expenses = await res.json();
    const list = document.getElementById('expenses-list');

    list.innerHTML = '';

    expenses.forEach(expense => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${expense.descripcion}</strong>
                <div style="font-size: 0.8rem; color: #666;">
                    ${new Date(expense.fecha).toLocaleDateString()} - ${expense.categoria_nombre} (${expense.cuenta_nombre})
                </div>
            </div>
            <span class="amount expense">-${formatCurrency(expense.monto)}</span>
        `;
        list.appendChild(div);
    });
}

document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById('desc-gasto').value;
    const monto = document.getElementById('monto-gasto').value;
    const id_categoria = document.getElementById('cat-gasto').value;
    const id_cuenta = document.getElementById('account-select').value;

    if (!id_cuenta || !id_categoria) {
        alert('Selecciona cuenta y categoría');
        return;
    }

    await fetch(`${API_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            descripcion,
            monto,
            id_categoria,
            id_cuenta,
            fecha: new Date().toISOString().split('T')[0]
        })
    });

    e.target.reset();
    loadExpenses();
});

// --- INIT ---
loadUsers();
loadExpenses();
