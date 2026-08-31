import { RecursoRepository } from "../repositories/recurso.repository";
import { RespuestaAPI, CrearRecursoDTO, ActualizarRecursoDTO } from "../models/recurso.model";

export class RecursoService {

    // Funciona para obtener todos los recursos activos
    static async obtenerTodos(): Promise<RespuestaAPI<any[]>> {
        try {
            const recursos = await RecursoRepository.listarRecursos();
            return {
                success: true,
                message: "Recursos obtenidos correctamente",
                data: recursos,
            };
        } catch (error: any) {
            return { success: false, message: "Error al obtener recursos", error: error.message };
        }
    }

    // Funciona para obtener un recurso específico por su ID
    static async obtenerPorId(id: number): Promise<RespuestaAPI<any>> {
        try {
            const recurso = await RecursoRepository.buscarRecursoPorId(id);
            if (!recurso) return { success: false, message: "Recurso no encontrado" };
            return { success: true, message: "Recurso encontrado", data: recurso };
        } catch (error: any) {
            return { success: false, message: "Error al buscar recurso", error: error.message };
        }
    }

    // Funciona para crear un nuevo recurso con validaciones
    static async crear(datos: CrearRecursoDTO): Promise<RespuestaAPI<any>> {
        try {
            if (datos.cantidad_total !== undefined && datos.cantidad_total < 0) {
                return { success: false, message: "La cantidad no puede ser negativa" };
            }

            await RecursoRepository.agregarRecurso(datos);
            return { success: true, message: "Recurso creado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al crear recurso", error: error.message };
        }
    }

    // Funciona para actualizar un recurso existente con validaciones
    static async actualizar(id: number, datos: ActualizarRecursoDTO): Promise<RespuestaAPI<any>> {
        try {
            const existe = await RecursoRepository.buscarRecursoPorId(id);
            if (!existe) return { success: false, message: "Recurso no encontrado" };

            if (datos.cantidad_total < 0) {
                return { success: false, message: "La cantidad no puede ser negativa" };
            }

            await RecursoRepository.actualizarRecurso(id, datos);
            return { success: true, message: "Recurso actualizado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al actualizar recurso", error: error.message };
        }
    }

    // Funciona para eliminar un recurso (soft delete)
    static async eliminar(id: number): Promise<RespuestaAPI<any>> {
        try {
            const existe = await RecursoRepository.buscarRecursoPorId(id);
            if (!existe) return { success: false, message: "Recurso no encontrado" };

            await RecursoRepository.eliminarRecurso(id);
            return { success: true, message: "Recurso eliminado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al eliminar recurso", error: error.message };
        }
    }
}