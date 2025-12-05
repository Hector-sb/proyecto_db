import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";

const router = express.Router();

// ---------------------- REGISTRO ----------------------
router.post("/register", async (req, res) => {
  const { nombre, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // 1. Crear usuario
    const usuario = await pool.query(
      "INSERT INTO usuarios(nombre, email) VALUES($1,$2) RETURNING id",
      [nombre, email]
    );

    // 2. Guardar contraseña cifrada
    await pool.query(
      "INSERT INTO contraseñas(usuario_id, password_hash, salt) VALUES($1,$2,$3)",
      [usuario.rows[0].id, hash, salt]
    );

    res.json({ message: "Usuario registrado", id: usuario.rows[0].id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error registrando usuario" });
  }
});

// ---------------------- LOGIN ----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await pool.query("SELECT * FROM usuarios WHERE email=$1", [
    email,
  ]);

  if (user.rowCount === 0)
    return res.status(400).json({ error: "Usuario no existe" });

  const passData = await pool.query(
    "SELECT * FROM contraseñas WHERE usuario_id=$1",
    [user.rows[0].id]
  );

  const valida = await bcrypt.compare(password, passData.rows[0].password_hash);

  if (!valida) return res.status(400).json({ error: "Contraseña incorrecta" });

  res.json({ message: "Login correcto", usuario: user.rows[0] });
});

export default router;
