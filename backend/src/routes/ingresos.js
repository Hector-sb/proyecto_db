import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Obtener ingresos de usuario
router.get("/usuario/:id_usuario", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM ingresos WHERE id_usuario=$1 ORDER BY fecha DESC",
      [req.params.id_usuario]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener ingresos" });
  }
});

// Crear ingreso
router.post("/", async (req, res) => {
  const { descripcion, fecha, monto, id_usuario } = req.body;

  try {
    await pool.query(
      "INSERT INTO ingresos (descripcion, fecha, monto, id_usuario) VALUES ($1,$2,$3,$4)",
      [descripcion, fecha, monto, id_usuario]
    );
    res.json({ message: "Ingreso agregado" });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar ingreso" });
  }
});

// Editar ingreso
router.put("/:id", async (req, res) => {
  const { descripcion, fecha, monto } = req.body;

  try {
    await pool.query(
      "UPDATE ingresos SET descripcion=$1, fecha=$2, monto=$3 WHERE id=$4",
      [descripcion, fecha, monto, req.params.id]
    );
    res.json({ message: "Ingreso actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar ingreso" });
  }
});

// Eliminar ingreso
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM ingresos WHERE id=$1", [req.params.id]);
    res.json({ message: "Ingreso eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar ingreso" });
  }
});

export default router;
