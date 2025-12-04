import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// Reintentos de conexión
const intentarConexion = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("📌 Conectado a PostgreSQL correctamente");
  } catch (error) {
    console.log("⛔ No se pudo conectar, reintentando en 3 segundos...");
    setTimeout(intentarConexion, 3000);
  }
};

intentarConexion();

export { pool };
