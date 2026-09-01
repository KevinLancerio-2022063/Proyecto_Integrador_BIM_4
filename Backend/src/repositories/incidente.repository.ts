import { pool } from "../config/database.config";
import { QueryResult } from "pg";
import { CrearIncidenteDTO, ActualizarIncidenteDTO } from "../models/incidente.model";

export class IncidenteRepository {

    // Funciona para listar todos los incidentes
    static async listarIncidentes() {
        const result: QueryResult = await pool.query("SELECT * FROM sp_listar_incidentes()");
        return result.rows;
    }

    // Funciona para buscar un incidente por su ID
    static async buscarIncidentePorId(id: number) {
        const result: QueryResult = await pool.query("SELECT * FROM sp_buscar_incidente($1)", [id]);
        return result.rows[0];
    }

    // Funciona para agregar un nuevo incidente a la base de datos
    static async agregarIncidente(datos: CrearIncidenteDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_agregar_incidente($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
            [
                datos.tipo,
                datos.titulo,
                datos.descripcion || null,
                datos.nivel_emergencia || "MEDIA",
                datos.zona_id,
                datos.reportado_por,
                datos.latitud !== undefined ? datos.latitud : null,
                datos.longitud !== undefined ? datos.longitud : null,
                datos.cantidad_personas_afectadas !== undefined ? datos.cantidad_personas_afectadas : 0,
                datos.observaciones || null,
            ]
        );
        return result;
    }

    // Funciona para actualizar un incidente existente
    static async actualizarIncidente(id: number, datos: ActualizarIncidenteDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_actualizar_incidente($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [
                id,
                datos.tipo || null,
                datos.titulo || null,
                datos.descripcion || null,
                datos.nivel_emergencia || null,
                datos.estado || null,
                datos.fecha_cierre || null,
                datos.latitud !== undefined ? datos.latitud : null,
                datos.longitud !== undefined ? datos.longitud : null,
                datos.cantidad_personas_afectadas !== undefined ? datos.cantidad_personas_afectadas : null,
                datos.observaciones || null,
            ]
        );
        return result;
    }

    // Funciona para eliminar un incidente
    static async eliminarIncidente(id: number) {
        const result: QueryResult = await pool.query("CALL sp_eliminar_incidente($1)", [id]);
        return result;
    }
}