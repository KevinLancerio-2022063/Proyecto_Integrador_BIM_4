import express, { Application, Request, Response } from "express";
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
import asignacionPersonalRoutes from "./routes/asignacion_personal.routes";
import alertaRoutes from "./routes/alerta.routes";

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API - ORDEN IMPORTANTE
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/zonas", zonaRoutes);
app.use("/api/recursos", recursoRoutes);
app.use("/api/refugios", refugioRoutes);
app.use("/api/asignaciones-recurso", asignacionRoutes);
app.use("/api/incidentes", incidenteRoutes);
app.use("/api/historial-incidentes", historialIncidenteRoutes);
app.use("/api/asignacion-personal", asignacionPersonalRoutes);
app.use("/api/alertas", alertaRoutes);

// Health check - DEBE IR DESPUÉS de las rutas
app.get("/api/health", (req: Request, res: Response) => {
    res.json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        message: "SIGED API is running",
        environment: process.env.NODE_ENV
    });
});

// Ruta raíz
app.get("/", (req: Request, res: Response) => {
    res.json({
        message: "SIGED API - Backend",
        version: "1.0.0",
        endpoints: {
            health: "/api/health",
            recursos: "/api/recursos",
            refugios: "/api/refugios",
            incidentes: "/api/incidentes"
        }
    });
});

// Manejo de errores 404
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.method} ${req.path} no encontrada`
    });
});

// Función para inicializar la app
export async function initializeApp() {
    try {
        await testConnection();
        console.log("✅ Conexion a PostgreSQL establecida");
        return app;
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error);
        throw error;
    }
}

// Middlewares
app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://proyecto-integrador-bim-4-2.onrender.com',
        process.env.CORS_ORIGIN || '*'
    ].filter(Boolean), // Elimina valores undefined o null
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

export default app;