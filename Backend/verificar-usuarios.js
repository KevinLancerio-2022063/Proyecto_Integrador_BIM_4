// Backend/verificar-usuarios.js
const { Pool } = require('pg');
require('dotenv').config();

async function verificar() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('🔍 Buscando usuarios en la base de datos...\n');
        
        // Listar todos los usuarios
        const res = await pool.query('SELECT id, nombre, email, rol, password_hash FROM usuario ORDER BY id');
        
        if (res.rows.length === 0) {
            console.log('❌ NO HAY USUARIOS EN LA BASE DE DATOS');
            console.log('   Debes ejecutar el seed primero.');
        } else {
            console.log(`✅ Encontrados ${res.rows.length} usuarios:\n`);
            res.rows.forEach((u, i) => {
                console.log(`${i+1}. Email: ${u.email}`);
                console.log(`   Nombre: ${u.nombre}`);
                console.log(`   Rol: ${u.rol}`);
                console.log(`   Hash: ${u.password_hash.substring(0, 30)}...`);
                console.log('');
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

verificar();