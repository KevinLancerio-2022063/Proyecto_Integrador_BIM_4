// Backend/migrar-db.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

async function ejecutarMigracion() {
    console.log('🚀 Iniciando migración de base de datos...');
    
    // Configuración robusta para Render
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // OBLIGATORIO para Render Free Tier
        },
        connectionTimeoutMillis: 10000, // Timeout de 10 segundos
        idleTimeoutMillis: 30000
    });

    try {
        const sqlPath = path.join(__dirname, '..', 'init.sql'); 
        console.log(`📂 Buscando SQL en: ${sqlPath}`);
        
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`Archivo init.sql no encontrado en: ${sqlPath}`);
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log(' Archivo SQL leído correctamente.');
        console.log('⚙️ Ejecutando sentencias en PostgreSQL (Render)...');

        // Ejecutar todo el script
        await pool.query(sql);

        console.log('\n✅ ¡MIGRACIÓN EXITOSA!');
        
        // Verificación
        const res = await pool.query('SELECT count(*) as total FROM usuario');
        console.log(`   - Usuarios en BD: ${res.rows[0].total}`);
        
        const admin = await pool.query("SELECT id, nombre, email, rol FROM usuario WHERE email = 'admin@sigid.com'");
        if(admin.rows.length > 0) {
            console.log('   ✅ Admin encontrado:', admin.rows[0].nombre, `(${admin.rows[0].rol})`);
        } else {
            console.log('   ⚠️ Usuario admin NO encontrado');
        }
        
    } catch (error) {
        console.error('\n❌ ERROR CRÍTICO:', error.message);
        if (error.detail) console.error('   Detalle:', error.detail);
        if (error.code) console.error('   Código DB:', error.code);
        console.error('\n💡 TIP: Verifica que DATABASE_URL en .env sea la External URL de Render');
    } finally {
        await pool.end();
        console.log('\n🔒 Conexión cerrada.');
        process.exit(0);
    }
}

ejecutarMigracion();