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

/* --- USERS --- */
app.get('/api/users', async (req, res) => {
  const r = await query('SELECT * FROM usuarios ORDER BY id');
  res.json(r.rows);
});

app.post('/api/users', async (req, res) => {
  const { nombre, email, limite_gastos } = req.body;
  const r = await query(
    'INSERT INTO usuarios (nombre,email,limite_gastos) VALUES ($1,$2,$3) RETURNING *',
    [nombre, email, limite_gastos || 0]
  );
  res.json(r.rows[0]);
});

app.get('/api/users/:id', async (req, res) => {
  const r = await query('SELECT * FROM usuarios WHERE id=$1', [req.params.id]);
  res.json(r.rows[0] || {});
});

app.put('/api/users/:id', async (req, res) => {
  const { nombre, email, limite_gastos } = req.body;
  const r = await query(
    'UPDATE usuarios SET nombre=$1, email=$2, limite_gastos=$3 WHERE id=$4 RETURNING *',
    [nombre, email, limite_gastos, req.params.id]
  );
  res.json(r.rows[0] || {});
});

app.delete('/api/users/:id', async (req, res) => {
  await query('DELETE FROM usuarios WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

/* --- GASTOS --- */
app.get('/api/gastos', async (req, res) => {
  const r = await query('SELECT * FROM gastos ORDER BY fecha DESC');
  res.json(r.rows);
});

app.post('/api/gastos', async (req, res) => {
  const { descripcion, monto, fecha, categoria, id_usuario } = req.body;
  const r = await query(
    'INSERT INTO gastos (descripcion,monto,fecha,categoria,id_usuario) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [descripcion, monto, fecha, categoria, id_usuario]
  );
  res.json(r.rows[0]);
});

app.put('/api/gastos/:id', async (req, res) => {
  const { descripcion, monto, fecha, categoria, id_usuario } = req.body;
  const r = await query(
    'UPDATE gastos SET descripcion=$1,monto=$2,fecha=$3,categoria=$4,id_usuario=$5 WHERE id=$6 RETURNING *',
    [descripcion, monto, fecha, categoria, id_usuario, req.params.id]
  );
  res.json(r.rows[0] || {});
});

app.delete('/api/gastos/:id', async (req, res) => {
  await query('DELETE FROM gastos WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

/* --- INGRESOS --- */
app.get('/api/ingresos', async (req, res) => {
  const r = await query('SELECT * FROM ingresos ORDER BY fecha DESC');
  res.json(r.rows);
});

app.post('/api/ingresos', async (req, res) => {
  const { descripcion, fecha, monto, id_usuario } = req.body;
  const r = await query(
    'INSERT INTO ingresos (descripcion,fecha,monto,id_usuario) VALUES ($1,$2,$3,$4) RETURNING *',
    [descripcion, fecha, monto, id_usuario]
  );
  res.json(r.rows[0]);
});

app.put('/api/ingresos/:id', async (req, res) => {
  const { descripcion, fecha, monto, id_usuario } = req.body;
  const r = await query(
    'UPDATE ingresos SET descripcion=$1,fecha=$2,monto=$3,id_usuario=$4 WHERE id=$5 RETURNING *',
    [descripcion, fecha, monto, id_usuario, req.params.id]
  );
  res.json(r.rows[0] || {});
});

app.delete('/api/ingresos/:id', async (req, res) => {
  await query('DELETE FROM ingresos WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

/* --- PAGOS RECURRENTES --- */
app.get('/api/pagos', async (req, res) => {
  const r = await query('SELECT * FROM pagos_recurrentes ORDER BY id');
  res.json(r.rows);
});

app.post('/api/pagos', async (req, res) => {
  const { descripcion, frecuencia_pago, monto, proximo_pago, id_usuario } = req.body;
  const r = await query(
    'INSERT INTO pagos_recurrentes (descripcion,frecuencia_pago,monto,proximo_pago,id_usuario) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [descripcion, frecuencia_pago, monto, proximo_pago, id_usuario]
  );
  res.json(r.rows[0]);
});

app.put('/api/pagos/:id', async (req, res) => {
  const { descripcion, frecuencia_pago, monto, proximo_pago, id_usuario } = req.body;
  const r = await query(
    'UPDATE pagos_recurrentes SET descripcion=$1,frecuencia_pago=$2,monto=$3,proximo_pago=$4,id_usuario=$5 WHERE id=$6 RETURNING *',
    [descripcion, frecuencia_pago, monto, proximo_pago, id_usuario, req.params.id]
  );
  res.json(r.rows[0] || {});
});

app.delete('/api/pagos/:id', async (req, res) => {
  await query('DELETE FROM pagos_recurrentes WHERE id=$1', [req.params.id]);
  res.json({ deleted: true });
});

/* --- inicio del servidor --- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
