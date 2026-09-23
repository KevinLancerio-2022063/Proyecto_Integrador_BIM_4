import { pool } from '../config/database.config';
import { Usuario, UsuarioResponse } from '../models/usuario.model';

export class UsuarioRepository {
    async findAll(): Promise<UsuarioResponse[]> {
        const result = await pool.query('SELECT * FROM sp_listar_usuarios()');
        return result.rows;
    }

    async findById(id: number): Promise<UsuarioResponse | null> {
        const result = await pool.query('SELECT * FROM sp_buscar_usuario($1)', [id]);
        return result.rows[0] || null;
    }

    async findByEmail(email: string): Promise<Usuario | null> {
        const result = await pool.query(
            'SELECT * FROM usuario WHERE email = $1 AND activo = true',
            [email]
        );
        return result.rows[0] || null;
    }

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
                usuario.disponible || false
            ]
        );
    }

    async update(id: number, usuario: Partial<Usuario>): Promise<void> {
        const current = await this.findById(id);
        if (!current) {
            throw new Error('Usuario no encontrado');
        }

        await pool.query(
            'CALL sp_actualizar_usuario($1, $2, $3, $4, $5, $6, $7)',
            [
                id,
                usuario.nombre || current.nombre,
                usuario.email || current.email,
                usuario.telefono || current.telefono,
                usuario.rol || current.rol,
                usuario.habilidades || current.habilidades,
                usuario.disponible ?? current.disponible
            ]
        );
    }

    async delete(id: number): Promise<void> {
        await pool.query('CALL sp_eliminar_usuario($1)', [id]);
    }
}