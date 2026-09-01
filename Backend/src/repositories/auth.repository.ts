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
}