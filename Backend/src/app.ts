import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Importa las rutas de los modulos
import recursoRoutes from "./routes/recurso.routes";
import refugioRoutes from "./routes/refugio.routes";
import asignacionRecursoRoutes from "./routes/asignacion_recurso.routes";

dotenv.config();

const app = express();

// Configura los middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Registra las rutas de los modulos
app.use("/api/recursos", recursoRoutes);
app.use("/api/refugios", refugioRoutes);
app.use("/api/asignaciones-recurso", asignacionRecursoRoutes);

// Ruta de prueba para verificar que el servidor funciona
app.get("/", (req, res) => {
    res.json({
        nombre: "SIGED API",
        version: "1.0.0",
        descripcion: "Sistema Integrado de Gestion de Emergencias y Desastres",
    });
});

export default app;
