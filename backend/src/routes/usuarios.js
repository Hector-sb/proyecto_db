import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios WHERE id=$1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// Actualizar usuario
router.put("/:id", async (req, res) => {
  const { nombre, email, limite_gastos } = req.body;

  try {
    await pool.query(
      "UPDATE usuarios SET nombre=$1, email=$2, limite_gastos=$3 WHERE id=$4",
      [nombre, email, limite_gastos, req.params.id]
    );

    res.json({ message: "Usuario actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM usuarios WHERE id=$1", [req.params.id]);
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

export default router;
