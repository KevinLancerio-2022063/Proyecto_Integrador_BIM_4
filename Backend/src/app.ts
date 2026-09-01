import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importa las rutas de los modulos
import asignacionPersonalRoutes from "./routes/asignacion_personal.routes";
import alertaRoutes from "./routes/alerta.routes";

dotenv.config();

const app = express();

// Configura los middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registra las rutas de los modulos
app.use("/api/alertas", alertaRoutes);
app.use("/api/asignacion_personal", asignacionPersonalRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
    res.json({
        nombre: "SIGED API",
        version: "1.0.0",
        descripcion: "Sistema Integrado de Gestion de Emergencias y Desastres",
    });
});

export default app;