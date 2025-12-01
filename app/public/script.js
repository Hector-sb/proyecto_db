const API_URL = 'http://localhost:3000/api';

// Utility to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
};

// Fetch and render Users
async function loadUsers() {
    const res = await fetch(`${API_URL}/users`);
    const users = await res.json();
    const list = document.getElementById('users-list');
    const select = document.getElementById('user-select');

    list.innerHTML = '';
    select.innerHTML = '<option value="">Seleccionar Usuario</option>';

    users.forEach(user => {
        // Add to list
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <div>
                <strong>${user.nombre}</strong>
                <div style="font-size: 0.8rem; color: #666;">${user.email}</div>
            </div>
            <span class="badge">Límite: ${formatCurrency(user.limite_gastos)}</span>
        `;
        list.appendChild(div);

        // Add to select dropdown
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.nombre;
        select.appendChild(option);
    });
}

// Create User
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const limite = document.getElementById('limite').value;

    await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, limite_gastos: limite })
    });

    e.target.reset();
    loadUsers();
});

// Fetch and render Expenses
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
                <div style="font-size: 0.8rem; color: #666;">${new Date(expense.fecha).toLocaleDateString()} - ${expense.categoria}</div>
            </div>
            <span class="amount expense">-${formatCurrency(expense.monto)}</span>
        `;
        list.appendChild(div);
    });
}

// Create Expense
document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const descripcion = document.getElementById('desc-gasto').value;
    const monto = document.getElementById('monto-gasto').value;
    const categoria = document.getElementById('cat-gasto').value;
    const userId = document.getElementById('user-select').value;

    if (!userId) {
        alert('Por favor selecciona un usuario');
        return;
    }

    await fetch(`${API_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            descripcion,
            monto,
            categoria,
            fecha: new Date().toISOString().split('T')[0],
            id_usuario: userId
        })
    });

    e.target.reset();
    loadExpenses();
});

// Initial load
loadUsers();
loadExpenses();
