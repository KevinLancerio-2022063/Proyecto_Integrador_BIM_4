// Backend/migrar-db.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg'); // Importamos pg directamente
require('dotenv').config(); // Cargamos las variables de entorno del .env

async function ejecutarMigracion() {
    console.log('🚀 Iniciando migración de base de datos...');
    
    // Creamos el pool de conexión EXACTAMENTE como lo hace tu app
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false // CRUCIAL para Render
        }
    });

    try {
        // Leer el archivo init.sql desde la raíz del proyecto
        const sqlPath = path.join(__dirname, '..', 'init.sql'); 
        console.log(`📂 Buscando SQL en: ${sqlPath}`);
        
        if (!fs.existsSync(sqlPath)) {
            throw new Error(`El archivo init.sql no se encontró en la ruta: ${sqlPath}`);
        }

        const sql = fs.readFileSync(sqlPath, 'utf8');
        console.log('📄 Archivo SQL leído correctamente.');
        console.log('️ Ejecutando sentencias en PostgreSQL (Render)...');

        // Ejecutar todo el script
        await pool.query(sql);

        console.log('\n✅ ¡MIGRACIÓN EXITOSA!');
        
        // Verificación rápida
        const res = await pool.query('SELECT count(*) FROM usuario');
        console.log(`   - Usuarios en BD: ${res.rows[0].count}`);
        
        const admin = await pool.query("SELECT id, nombre, email, rol FROM usuario WHERE email = 'admin@sigid.com'");
        if(admin.rows.length > 0) {
            console.log('   - Admin encontrado:', admin.rows[0].nombre, `(${admin.rows[0].rol})`);
        } else {
            console.log('   ⚠️  Usuario admin NO encontrado. Revisa los INSERTs en init.sql');
        }
        
    } catch (error) {
        console.error('\n❌ ERROR CRÍTICO:', error.message);
        if (error.detail) console.error('   Detalle:', error.detail);
        if (error.code) console.error('   Código DB:', error.code);
    } finally {
        await pool.end();
        console.log('\n🔒 Conexión cerrada.');
        process.exit(0);
    }
}

ejecutarMigracion();