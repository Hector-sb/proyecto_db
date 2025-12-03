import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// Obtener pagos recurrentes de un usuario
router.get("/usuario/:id_usuario", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM pagos_recurrentes WHERE id_usuario=$1 ORDER BY proximo_pago ASC",
      [req.params.id_usuario]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener pagos recurrentes" });
  }
});

// Crear pago recurrente
router.post("/", async (req, res) => {
  const { descripcion, frecuencia_pago, monto, proximo_pago, id_usuario } = req.body;

  try {
    await pool.query(
      "INSERT INTO pagos_recurrentes (descripcion, frecuencia_pago, monto, proximo_pago, id_usuario) VALUES ($1,$2,$3,$4,$5)",
      [descripcion, frecuencia_pago, monto, proximo_pago, id_usuario]
    );
    res.json({ message: "Pago recurrente agregado" });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar pago recurrente" });
  }
});

// Editar pago recurrente
router.put("/:id", async (req, res) => {
  const { descripcion, frecuencia_pago, monto, proximo_pago } = req.body;

  try {
    await pool.query(
      "UPDATE pagos_recurrentes SET descripcion=$1, frecuencia_pago=$2, monto=$3, proximo_pago=$4 WHERE id=$5",
      [descripcion, frecuencia_pago, monto, proximo_pago, req.params.id]
    );
    res.json({ message: "Pago recurrente actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar pago recurrente" });
  }
});

// Eliminar pago recurrente
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM pagos_recurrentes WHERE id=$1", [
      req.params.id,
    ]);
    res.json({ message: "Pago recurrente eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar pago recurrente" });
  }
});

export default router;
