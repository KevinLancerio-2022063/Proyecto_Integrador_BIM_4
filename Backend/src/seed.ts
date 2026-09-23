// Backend/src/seed.ts
import { pool } from './config/database.config';
import * as bcrypt from 'bcryptjs';

async function seed() {
    try {
        console.log('Iniciando seed de usuarios...');

        const usuarios = [
            { nombre: 'Carlos Méndez',  email: 'carlos.mendez@siged.com',  password: 'admin123',      telefono: '5555-1001', rol: 'ADMIN',            habilidades: 'Gestión de emergencias', disponible: true },
            { nombre: 'María González', email: 'maria.gonzalez@siged.com', password: 'coord123',      telefono: '5555-1002', rol: 'COORDINADOR',      habilidades: 'Coordinación de equipos', disponible: true },
            { nombre: 'Juan Pérez',     email: 'juan.perez@siged.com',     password: 'rescatista123', telefono: '5555-1003', rol: 'RESCATISTA',       habilidades: 'Rescate acuático',       disponible: true },
            { nombre: 'Ana Rodríguez',  email: 'ana.rodriguez@siged.com',  password: 'gestor123',     telefono: '5555-1004', rol: 'GESTOR_REFUGIO',   habilidades: 'Gestión de albergues',   disponible: true },
            { nombre: 'Luis Martínez',  email: 'luis.martinez@siged.com',  password: 'voluntario123', telefono: '5555-1005', rol: 'VOLUNTARIO',       habilidades: 'Apoyo general',          disponible: true },
        ];

        for (const u of usuarios) {
            const hash = await bcrypt.hash(u.password, 10);
            await pool.query(
                'CALL sp_agregar_usuario($1, $2, $3, $4, $5, $6, $7)',
                [u.nombre, u.email, hash, u.telefono, u.rol, u.habilidades, u.disponible]
            );
            console.log(`✓ Usuario creado: ${u.email} | password: ${u.password}`);
        }

        console.log('\nSeed completado. Credenciales:');
        console.log('  admin@siged.com       → admin123');
        console.log('  maria.gonzalez@siged.com → coord123');
        console.log('  juan.perez@siged.com  → rescatista123');
        console.log('  ana.rodriguez@siged.com  → gestor123');
        console.log('  luis.martinez@siged.com  → voluntario123');
    } catch (error) {
        console.error('Error en seed:', error);
    } finally {
        await pool.end();
    }
}

seed();