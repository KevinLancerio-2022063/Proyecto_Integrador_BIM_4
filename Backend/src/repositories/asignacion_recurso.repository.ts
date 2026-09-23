import { pool } from "../config/database.config";
import { QueryResult } from "pg";
import { CrearAsignacionRecursoDTO, ActualizarAsignacionRecursoDTO } from "../models/asignacion_recurso.model";

export class AsignacionRecursoRepository {

    // Obtiene todas las asignaciones de recursos desde la base de datos
    static async listarAsignaciones() {
        const result: QueryResult = await pool.query("SELECT * FROM sp_listar_asignaciones_recurso()");
        return result.rows;
    }

    // Busca una asignacion de recurso especifica por su ID
    static async buscarAsignacionPorId(id: number) {
        const result: QueryResult = await pool.query("SELECT * FROM sp_buscar_asignacion_recurso($1)", [id]);
        return result.rows[0];
    }

    // Agrega una nueva asignacion de recurso a la base de datos
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

    // Actualiza una asignacion de recurso existente en la base de datos
    static async actualizarAsignacion(id: number, datos: ActualizarAsignacionRecursoDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_actualizar_asignacion_recurso($1, $2, $3, $4, $5, $6, $7)",
            [
                id,
                datos.cantidad,
                datos.estado,
                datos.fecha_asignacion || null,
                datos.fecha_entrega || null,
                datos.observaciones || null,
                datos.usuario_asigna_id || null
            ]
        );
        return result;
    }

    // Elimina una asignacion de recurso (soft delete marcandola como cancelada)
    static async eliminarAsignacion(id: number) {
        const result: QueryResult = await pool.query("CALL sp_eliminar_asignacion_recurso($1)", [id]);
        return result;
    }
}