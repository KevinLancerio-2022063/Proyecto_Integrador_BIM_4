import { pool } from "../config/database.config";
import { QueryResult } from "pg";
import { CrearRecursoDTO, ActualizarRecursoDTO } from "../models/recurso.model";

export class RecursoRepository {

    // Funciona para listar todos los recursos activos
    static async listarRecursos() {
        const result: QueryResult = await pool.query("SELECT * FROM sp_listar_recursos()");
        return result.rows;
    }

    // Funciona para buscar un recurso por su ID
    static async buscarRecursoPorId(id: number) {
        const result: QueryResult = await pool.query("SELECT * FROM sp_buscar_recurso($1)", [id]);
        return result.rows[0];
    }

    // Funciona para agregar un nuevo recurso a la base de datos
    static async agregarRecurso(datos: CrearRecursoDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_agregar_recurso($1, $2, $3, $4, $5)",
            [
                datos.nombre,
                datos.tipo,
                datos.unidad_medida || "UNIDAD",
                datos.cantidad_total !== undefined ? datos.cantidad_total : 0,
                datos.descripcion || null,
            ]
        );
        return result;
    }

    // Funciona para actualizar un recurso existente
    static async actualizarRecurso(id: number, datos: ActualizarRecursoDTO) {
        const result: QueryResult = await pool.query(
            "CALL sp_actualizar_recurso($1, $2, $3, $4, $5, $6)",
            [
                id,
                datos.nombre,
                datos.tipo,
                datos.unidad_medida,
                datos.cantidad_total,
                datos.descripcion,
            ]
        );
        return result;
    }

    // Funciona para eliminar un recurso (soft delete)
    static async eliminarRecurso(id: number) {
        const result: QueryResult = await pool.query("CALL sp_eliminar_recurso($1)", [id]);
        return result;
    }
}