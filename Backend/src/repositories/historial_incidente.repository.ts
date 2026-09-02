import { pool } from "../config/database.config";
import { QueryResult } from "pg";
import { CrearHistorialIncidenteDTO, ActualizarHistorialIncidenteDTO } from "../models/historial_incidente.model";

export class HistorialIncidenteRepository {

     // Funciona para listar todos los historiales
    static async listarHistorialIncidente(historialId: number) {
    const result: QueryResult = await pool.query("SELECT * FROM sp_listar_historial_incidentes($1)", [historialId]);
    return result.rows;
}

 // Funciona para buscar un incidente por su ID
    static async buscarHistorialPorId(id: number) {
        const result: QueryResult = await pool.query("SELECT * FROM sp_buscar_historial_por_id($1)", [id]);
        return result.rows[0];
    }

    // Funciona para agregar un nuevo incidente a la base de datos
        static async agregarIncidente(datos: CrearHistorialIncidenteDTO) {
            const result: QueryResult = await pool.query(
                "CALL sp_agregar_historial_incidente($1, $2, $3, $4, $5)",
                [
                    datos.incidente_id,
                    datos.estado_nuevo,
                    datos.estado_anterior || null,
                    datos.comentario || null,
                    datos.usuario_id !== undefined ? datos.usuario_id : null
                ]
            );
            return result;
        }

        // Funciona para actualizar un incidente existente
        static async actualizarIncidente(id: number, datos: ActualizarHistorialIncidenteDTO) {
            const incidenteActual = await this.buscarHistorialPorId(id);
        
            const result: QueryResult = await pool.query(
                "CALL sp_actualizar_historial_incidente($1, $2)",
                [
                    id,
                    datos.comentario || null
                ]
            );
            return result;
        }

        // Funciona para eliminar un incidente
    static async eliminarHistorialIncidente(id: number) {
        const result: QueryResult = await pool.query("CALL sp_eliminar_historial_incidente($1)", [id]);
        return result;
    }

}