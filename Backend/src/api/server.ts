import app from "../app";
import { pool, testConnection } from "../config/database.config";

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Probar conexión a la base de datos
        console.log("Conectando a PostgreSQL");
        await testConnection();
        
        // Iniciar servidor HTTP
        app.listen(PORT, () => {
            console.log("===========================================");
            console.log(`Servidor corriendo en puerto ${PORT}`);
            console.log(`Entorno: ${process.env.NODE_ENV || "development"}`);
            console.log(`URL: http://localhost:${PORT}`);
            console.log(`API Health: http://localhost:${PORT}/api/health`);
            console.log("===========================================");
        });
    } catch (error) {
        console.error("No se pudo iniciar el servidor:", error);
        process.exit(1);
    }
}

// Manejo de cierre graceful
process.on("SIGINT", async () => {
    console.log("Cerrando servidor");
    await pool.end();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Cerrando servidor");
    await pool.end();
    process.exit(0);
});

startServer();