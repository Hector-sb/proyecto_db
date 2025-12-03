import express from "express";
import cors from "cors";

// Importación de rutas
import auth from "./routes/auth.js";
import usuarios from "./routes/usuarios.js";
import gastos from "./routes/gastos.js";
import ingresos from "./routes/ingresos.js";
import recurrentes from "./routes/recurrentes.js";

const app = express();
app.use(cors());
app.use(express.json());

// RUTAS
app.use("/auth", auth);              // Registro y login
app.use("/usuarios", usuarios);      // CRUD de usuarios
app.use("/gastos", gastos);          // CRUD de gastos
app.use("/ingresos", ingresos);      // CRUD de ingresos
app.use("/recurrentes", recurrentes);// CRUD de pagos recurrentes

app.listen(4000, () => console.log("Backend en http://localhost:4000"));
