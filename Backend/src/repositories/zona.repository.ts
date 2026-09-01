import { pool } from '../config/database.config';
import { Zona, ZonaResponse } from '../models/zona.model';

export class ZonaRepository {
    async findAll(): Promise<ZonaResponse[]> {
        const result = await pool.query('SELECT * FROM sp_listar_zonas()');
        return result.rows;
    }

    async findById(id: number): Promise<ZonaResponse | null> {
        const result = await pool.query('SELECT * FROM sp_buscar_zona($1)', [id]);
        return result.rows[0] || null;
    }

    async create(zona: Zona): Promise<void> {
        await pool.query(
            'CALL sp_agregar_zona($1, $2, $3, $4, $5, $6, $7)',
            [
                zona.nombre,
                zona.municipio || null,
                zona.departamento || null,
                zona.pais || 'Guatemala',
                zona.latitud || null,
                zona.longitud || null,
                zona.nivel_riesgo
            ]
        );
    }

    async update(id: number, zona: Partial<Zona>): Promise<void> {
        const current = await this.findById(id);
        if (!current) {
            throw new Error('Zona no encontrada');
        }

        await pool.query(
            'CALL sp_actualizar_zona($1, $2, $3, $4, $5, $6, $7, $8)',
            [
                id,
                zona.nombre || current.nombre,
                zona.municipio || current.municipio,
                zona.departamento || current.departamento,
                zona.pais || current.pais,
                zona.latitud || current.latitud,
                zona.longitud || current.longitud,
                zona.nivel_riesgo || current.nivel_riesgo
            ]
        );
    }

    async delete(id: number): Promise<void> {
        await pool.query('CALL sp_eliminar_zona($1)', [id]);
    }
}