import { pool } from "../config/database.config";
import { QueryResult } from "pg";
import { CrearRefugioDTO, ActualizarRefugioDTO } from "../models/refugio.model";

export class RefugioRepository {

    // Funciona para listar todos los refugios activos
    static async listarRefugios() {
        const result: QueryResult = await pool.query("SELECT * FROM sp_listar_refugios()");
        return result.rows;
    }

    // Funciona para buscar un refugio por su ID
    static async buscarRefugioPorId(id: number) {
        const result: QueryResult = await pool.query("SELECT * FROM sp_buscar_refugio($1)", [id]);
        return result.rows[0];
    }

    // Funciona para agregar un nuevo refugio a la base de datos
    static async agregarRefugio(datos: CrearRefugioDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_agregar_refugio($1, $2, $3, $4, $5, $6, $7, $8)",
            [
                datos.nombre,
                datos.capacidad_total,
                datos.direccion || null,
                datos.zona_id || null,
                datos.latitud || null,
                datos.longitud || null,
                datos.responsable_id || null,
                datos.telefono_contacto || null,
            ]
        );
        return result;
    }

    // Funciona para actualizar un refugio existente
    static async actualizarRefugio(id: number, datos: ActualizarRefugioDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_actualizar_refugio($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
            [
                id,
                datos.nombre,
                datos.direccion,
                datos.zona_id,
                datos.latitud,
                datos.longitud,
                datos.capacidad_total,
                datos.ocupacion_actual,
                datos.estado,
                datos.responsable_id,
                datos.telefono_contacto,
                datos.observaciones,
            ]
        );
        return result;
    }

    // Funciona para eliminar un refugio (soft delete)
    static async eliminarRefugio(id: number) {
        const result: QueryResult = await pool.query("CALL sp_eliminar_refugio($1)", [id]);
        return result;
    }
}