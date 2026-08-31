import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importa las rutas
import recursoRoutes from "./routes/recurso.routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de prueba
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API SIGED funcionando correctamente",
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API
app.use("/api/recursos", recursoRoutes);

// Ruta raíz
app.get("/", (req, res) => {
    res.json({
        nombre: "SIGED API",
        version: "1.0.0",
        descripcion: "Sistema Integrado de Gestión de Emergencias y Desastres"
    });
});

export default app;