import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Obtener gastos de un usuario
router.get("/usuario/:id_usuario", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gastos WHERE id_usuario=$1 ORDER BY fecha DESC",
      [req.params.id_usuario]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener gastos" });
  }
});

// Crear gasto
router.post("/", async (req, res) => {
  const { descripcion, monto, fecha, categoria, id_usuario } = req.body;

  try {
    await pool.query(
      "INSERT INTO gastos (descripcion, monto, fecha, categoria, id_usuario) VALUES ($1,$2,$3,$4,$5)",
      [descripcion, monto, fecha, categoria, id_usuario]
    );
    res.json({ message: "Gasto agregado" });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar gasto" });
  }
});

// Editar gasto
router.put("/:id", async (req, res) => {
  const { descripcion, monto, fecha, categoria } = req.body;

  try {
    await pool.query(
      "UPDATE gastos SET descripcion=$1, monto=$2, fecha=$3, categoria=$4 WHERE id=$5",
      [descripcion, monto, fecha, categoria, req.params.id]
    );
    res.json({ message: "Gasto actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar gasto" });
  }
});

// Eliminar gasto
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM gastos WHERE id=$1", [req.params.id]);
    res.json({ message: "Gasto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar gasto" });
  }
});

export default router;
