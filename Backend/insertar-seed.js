// Backend/insertar-seed.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs'); // Asegúrate de tenerlo instalado: npm install bcryptjs
require('dotenv').config();

async function insertarSeed() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    const usuarios = [
        { nombre: 'Carlos Méndez',  email: 'carlos.mendez@siged.com',  password: 'admin123',      telefono: '5555-1001', rol: 'ADMIN',            habilidades: 'Gestión de emergencias', disponible: true },
        { nombre: 'María González', email: 'maria.gonzalez@siged.com', password: 'coord123',      telefono: '5555-1002', rol: 'COORDINADOR',      habilidades: 'Coordinación de equipos', disponible: true },
        { nombre: 'Juan Pérez',     email: 'juan.perez@siged.com',     password: 'rescatista123', telefono: '5555-1003', rol: 'RESCATISTA',       habilidades: 'Rescate acuático',       disponible: true },
        { nombre: 'Ana Rodríguez',  email: 'ana.rodriguez@siged.com',  password: 'gestor123',     telefono: '5555-1004', rol: 'GESTOR_REFUGIO',   habilidades: 'Gestión de albergues',   disponible: true },
        { nombre: 'Luis Martínez',  email: 'luis.martinez@siged.com',  password: 'voluntario123', telefono: '5555-1005', rol: 'VOLUNTARIO',       habilidades: 'Apoyo general',          disponible: true },
    ];

    try {
        console.log('🌱 Insertando usuarios del seed...\n');
        
        for (const u of usuarios) {
            const hash = await bcrypt.hash(u.password, 10);
            
            // Usamos ON CONFLICT para evitar errores si ya existen
            const query = `
                INSERT INTO usuario (nombre, email, password_hash, telefono, rol, habilidades, disponible)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (email) DO UPDATE SET 
                    nombre = EXCLUDED.nombre,
                    password_hash = EXCLUDED.password_hash,
                    rol = EXCLUDED.rol
            `;
            
            await pool.query(query, [u.nombre, u.email, hash, u.telefono, u.rol, u.habilidades, u.disponible]);
            console.log(`✅ Insertado/Actualizado: ${u.email} (${u.rol})`);
        }
        
        console.log('\n🎉 ¡Seed completado exitosamente!');
        console.log('Ahora puedes iniciar sesión con carlos.mendez@siged.com / admin123');
        
    } catch (error) {
        console.error(' Error:', error.message);
        if (error.detail) console.error('Detalle:', error.detail);
    } finally {
        await pool.end();
    }
}

insertarSeed();