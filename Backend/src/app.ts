import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { testConnection } from "./config/database.config";

// Importar rutas
import authRoutes from "./routes/auth.routes";
import usuarioRoutes from "./routes/usuario.routes";
import zonaRoutes from "./routes/zona.routes";
import recursoRoutes from "./routes/recurso.routes";
import refugioRoutes from "./routes/refugio.routes";
import asignacionRoutes from "./routes/asignacion_recurso.routes";
import incidenteRoutes from "./routes/incidente.routes";
import historialIncidenteRoutes from "./routes/historial_incidente.routes";


dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:4200"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/zonas", zonaRoutes);
app.use("/api/recursos", recursoRoutes);
app.use("/api/refugios", refugioRoutes);
app.use("/api/asignaciones-recurso", asignacionRoutes);
app.use("/api/incidentes", incidenteRoutes);
app.use("/api/historial-incidentes", historialIncidenteRoutes);

// Ruta de salud
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "OK", 
        timestamp: new Date(),
        message: "SIGED API is running"
    });
});

// Exportar app para que la use server.ts
export default app;

// Función para inicializar la app
export async function initializeApp() {
    try {
        await testConnection();
        console.log("Conexion a PostgreSQL establecida");
        return app;
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        throw error;
    }
}
