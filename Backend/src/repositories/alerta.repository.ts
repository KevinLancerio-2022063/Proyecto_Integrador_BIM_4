import { pool } from '../config/database.config';
import { QueryResult } from 'pg';
import {
    CrearAlertaDTO,
    ActualizarAlertaDTO,
} from '../models/alerta.model';

export class AlertaRepository {

    // Listar todas las alertas
    static async listarAlertas() {
        const result: QueryResult = await pool.query(
            'SELECT * FROM sp_listar_alertas()',
        );

        return result.rows;
    }

    // Buscar una alerta por su ID
    static async buscarAlertaPorId(id: number) {
        const result: QueryResult = await pool.query(
            'SELECT * FROM sp_buscar_alerta($1)',
            [id],
        );

        return result.rows[0];
    }

    // Agregar una nueva alerta
    static async agregarAlerta(datos: CrearAlertaDTO) {
        const result: QueryResult = await pool.query(
            'CALL sp_agregar_alerta($1, $2, $3, $4, $5, $6)',
            [
                datos.tipo,
                datos.nivel,
                datos.mensaje,
                datos.incidente_id ?? null,
                datos.zona_id ?? null,
                datos.refugio_id ?? null,
            ],
        );

        return result;
    }

    // Actualizar una alerta existente
    static async actualizarAlerta(
        id: number,
        datos: ActualizarAlertaDTO,
    ) {
        const result: QueryResult = await pool.query(
            'CALL sp_actualizar_alerta($1, $2)',
            [
                id,
                datos.estado ?? null,
            ],
        );

        return result;
    }

    // Eliminar o cerrar una alerta
    static async eliminarAlerta(id: number) {
        const result: QueryResult = await pool.query(
            'CALL sp_eliminar_alerta($1)',
            [id],
        );

        return result;
    }
}