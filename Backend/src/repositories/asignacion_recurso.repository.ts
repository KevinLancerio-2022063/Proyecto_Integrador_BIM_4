import { pool } from "../config/database.config";
import { QueryResult } from "pg";
import { CrearAsignacionRecursoDTO, ActualizarAsignacionRecursoDTO } from "../models/asignacion_recurso.model";

export class AsignacionRecursoRepository {

    // Funciona para listar todas las asignaciones de recursos
    static async listarAsignaciones() {
        const result: QueryResult = await pool.query("SELECT * FROM sp_listar_asignaciones_recurso()");
        return result.rows;
    }

    // Funciona para buscar una asignacion de recurso por su ID
    static async buscarAsignacionPorId(id: number) {
        const result: QueryResult = await pool.query("SELECT * FROM sp_buscar_asignacion_recurso($1)", [id]);
        return result.rows[0];
    }

    // Funciona para agregar una nueva asignacion de recurso a la base de datos
    static async agregarAsignacion(datos: CrearAsignacionRecursoDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_agregar_asignacion_recurso($1, $2, $3, $4, $5, $6, $7)",
            [
                datos.recurso_id,
                datos.cantidad,
                datos.estado || "SOLICITADO",
                datos.incidente_id || null,
                datos.refugio_id || null,
                datos.usuario_asigna_id || null,
                datos.observaciones || null,
            ]
        );
        return result;
    }

    // Funciona para actualizar una asignacion de recurso existente
    static async actualizarAsignacion(id: number, datos: ActualizarAsignacionRecursoDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_actualizar_asignacion_recurso($1, $2, $3, $4, $5, $6)",
            [
                id,
                datos.cantidad,
                datos.estado,
                datos.fecha_asignacion || null,
                datos.fecha_entrega || null,
                datos.observaciones || null,
            ]
        );
        return result;
    }

    // Funciona para eliminar una asignacion de recurso (soft delete - marcar como cancelado)
    static async eliminarAsignacion(id: number) {
        const result: QueryResult = await pool.query("CALL sp_eliminar_asignacion_recurso($1)", [id]);
        return result;
    }
}
