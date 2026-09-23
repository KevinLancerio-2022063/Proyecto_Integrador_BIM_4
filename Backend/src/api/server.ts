import app, { initializeApp } from "../app";
import { pool } from "../config/database.config";

const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
    try {
        console.log("🚀 Iniciando SIGED Server...");
        
        // Inicializar aplicación y conectar a BD
        await initializeApp();
        
        // Iniciar servidor HTTP
        const server = app.listen(PORT, () => {
            console.log("===========================================");
            console.log(`✅ Servidor corriendo en puerto ${PORT}`);
            console.log(`📋 Entorno: ${process.env.NODE_ENV || "development"}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(` API Health: http://localhost:${PORT}/api/health`);
            console.log(` Auth: http://localhost:${PORT}/api/auth/login`);
            console.log("===========================================");
        });

        server.on('error', (error: any) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Puerto ${PORT} ya está en uso`);
            } else {
                console.error(' Error del servidor:', error);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error(" No se pudo iniciar el servidor:", error);
        process.exit(1);
    }
}

// Manejo de cierre graceful
process.on("SIGINT", async () => {
    console.log("\n Cerrando servidor...");
    await pool.end();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("\n🛑 Cerrando servidor...");
    await pool.end();
    process.exit(0);
});

startServer();