const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'gastos',
  max: 10
});

async function query(sql, params) {
  const client = await pool.connect();
  try {
    const res = await client.query(sql, params);
    return res;
  } finally {
    client.release();
  }
}

/* --- USUARIOS --- */
app.get('/api/users', async (req, res) => {
  const r = await query('SELECT * FROM Usuarios ORDER BY id_usuario');
  res.json(r.rows);
});

app.post('/api/users', async (req, res) => {
  const { nombre, email, password, limite_gastos_global } = req.body;
  try {
    const r = await query(
      'INSERT INTO Usuarios (nombre, email, password, limite_gastos_global) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, password || '123456', limite_gastos_global || 0]
    );
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* --- CUENTAS --- */
app.get('/api/cuentas', async (req, res) => {
  const { id_usuario } = req.query;
  let sql = 'SELECT * FROM Cuentas';
  let params = [];
  if (id_usuario) {
    sql += ' WHERE id_usuario = $1';
    params.push(id_usuario);
  }
  sql += ' ORDER BY id_cuenta';
  const r = await query(sql, params);
  res.json(r.rows);
});

app.post('/api/cuentas', async (req, res) => {
  const { id_usuario, nombre, tipo, saldo_inicial } = req.body;
  try {
    const r = await query(
      'INSERT INTO Cuentas (id_usuario, nombre, tipo, saldo_inicial) VALUES ($1, $2, $3, $4) RETURNING *',
      [id_usuario, nombre, tipo, saldo_inicial || 0]
    );
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* --- CATEGORIAS --- */
app.get('/api/categorias', async (req, res) => {
  const { id_usuario, tipo } = req.query;
  let sql = 'SELECT * FROM Categorias WHERE 1=1';
  let params = [];
  let pIdx = 1;

  if (id_usuario) {
    sql += ` AND id_usuario = $${pIdx++}`;
    params.push(id_usuario);
  }
  if (tipo) {
    sql += ` AND tipo = $${pIdx++}`;
    params.push(tipo);
  }

  sql += ' ORDER BY nombre';
  const r = await query(sql, params);
  res.json(r.rows);
});

app.post('/api/categorias', async (req, res) => {
  const { id_usuario, nombre, tipo } = req.body;
  try {
    const r = await query(
      'INSERT INTO Categorias (id_usuario, nombre, tipo) VALUES ($1, $2, $3) RETURNING *',
      [id_usuario, nombre, tipo]
    );
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* --- GASTOS --- */
app.get('/api/gastos', async (req, res) => {
  const r = await query(`
    SELECT g.*, c.nombre as categoria_nombre, cu.nombre as cuenta_nombre 
    FROM Gastos g
    JOIN Categorias c ON g.id_categoria = c.id_categoria
    JOIN Cuentas cu ON g.id_cuenta = cu.id_cuenta
    ORDER BY g.fecha DESC
  `);
  res.json(r.rows);
});

app.post('/api/gastos', async (req, res) => {
  const { id_cuenta, id_categoria, monto, descripcion, fecha } = req.body;
  try {
    const r = await query(
      'INSERT INTO Gastos (id_cuenta, id_categoria, monto, descripcion, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_cuenta, id_categoria, monto, descripcion, fecha]
    );
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* --- INGRESOS --- */
app.get('/api/ingresos', async (req, res) => {
  const r = await query('SELECT * FROM Ingresos ORDER BY fecha DESC');
  res.json(r.rows);
});

app.post('/api/ingresos', async (req, res) => {
  const { id_cuenta, id_categoria, monto, descripcion, fecha } = req.body;
  try {
    const r = await query(
      'INSERT INTO Ingresos (id_cuenta, id_categoria, monto, descripcion, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_cuenta, id_categoria, monto, descripcion, fecha]
    );
    res.json(r.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* --- inicio del servidor --- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
