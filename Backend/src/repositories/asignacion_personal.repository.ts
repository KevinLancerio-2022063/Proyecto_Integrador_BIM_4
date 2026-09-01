import { pool } from '../config/database.config';
import { QueryResult } from 'pg';
import {
    CrearAsignacionPersonalDTO,
    ActualizarAsignacionPersonalDTO,
} from '../models/asignacion_personal.model';

export class AsignacionPersonalRepository {

    // Listar todas las asignaciones
    static async listarAsignaciones() {
        const result: QueryResult = await pool.query(
            'SELECT * FROM sp_listar_asignaciones_personal()',
        );

        return result.rows;
    }

    // Buscar una asignación por su ID
    static async buscarAsignacionPorId(id: number) {
        const result: QueryResult = await pool.query(
            'SELECT * FROM sp_buscar_asignacion_personal($1)',
            [id],
        );

        return result.rows[0];
    }

    // Agregar una nueva asignación
    static async agregarAsignacion(
        datos: CrearAsignacionPersonalDTO,
    ) {
        const result: QueryResult = await pool.query(
            'CALL sp_agregar_asignacion_personal($1, $2, $3, $4, $5, $6, $7)',
            [
                datos.usuario_id,
                datos.incidente_id ?? null,
                datos.refugio_id ?? null,
                datos.rol_asignado ?? 'APOYO',
                datos.estado ?? 'ASIGNADO',
                datos.fecha_asignacion ?? null,
                datos.observaciones ?? null,
            ],
        );

        return result;
    }

    // Actualizar una asignación existente
    static async actualizarAsignacion(
        id: number,
        datos: ActualizarAsignacionPersonalDTO,
    ) {
        const result: QueryResult = await pool.query(
            'CALL sp_actualizar_asignacion_personal($1, $2, $3, $4, $5, $6, $7, $8)',
            [
                id,
                datos.usuario_id ?? null,
                datos.incidente_id ?? null,
                datos.refugio_id ?? null,
                datos.rol_asignado ?? null,
                datos.estado ?? null,
                datos.fecha_finalizacion ?? null,
                datos.observaciones ?? null,
            ],
        );

        return result;
    }

    // Cancelar una asignación
    static async eliminarAsignacion(id: number) {
        const result: QueryResult = await pool.query(
            'CALL sp_eliminar_asignacion_personal($1)',
            [id],
        );

        return result;
    }
}