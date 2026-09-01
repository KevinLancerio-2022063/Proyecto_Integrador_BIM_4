import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import recursoRoutes from "./routes/incidente.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API SIGED funcionando correctamente",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/incidentes", recursoRoutes);

app.get("/", (req, res) => {
    res.json({
        nombre: "SIGED API",
        version: "1.0.0",
        descripcion: "Sistema Integrado de Gestión de Emergencias y Desastres"
    });
});

export default app;