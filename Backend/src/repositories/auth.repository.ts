import { pool } from '../config/database.config';
import { Usuario } from '../models/usuario.model';

export class AuthRepository {
    async findByEmail(email: string): Promise<Usuario | null> {
        const result = await pool.query(
            'SELECT * FROM usuario WHERE email = $1 AND activo = true',
            [email]
        );
        return result.rows[0] || null;
    }

    // ⬇️ NUEVO MÉTODO
    async create(usuario: Usuario): Promise<void> {
        await pool.query(
            'CALL sp_agregar_usuario($1, $2, $3, $4, $5, $6, $7)',
            [
                usuario.nombre,
                usuario.email,
                usuario.password_hash,
                usuario.telefono || null,
                usuario.rol,
                usuario.habilidades || null,
                usuario.disponible ?? false
            ]
        );
    }
}