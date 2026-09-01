import { pool } from "../config/database.config";
import { QueryResult } from "pg";
import { CrearHistorialIncidenteDTO } from "../models/historial_incidente.model";

export class HistorialIncidenteRepository {

    static async obtenerHistorialPorIncidente(incidenteId: number) {
        const result: QueryResult = await pool.query(
            "SELECT * FROM sp_obtener_historial_incidente($1)",
            [incidenteId]
        );
        return result.rows;
    }

    static async agregarHistorial(datos: CrearHistorialIncidenteDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_agregar_historial_incidente($1, $2, $3, $4, $5)",
            [
                datos.incidente_id,
                datos.estado_anterior || null,
                datos.estado_nuevo,
                datos.comentario || null,
                datos.usuario_id !== undefined ? datos.usuario_id : null,
            ]
        );
        return result;
    }
}