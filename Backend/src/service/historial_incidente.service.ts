import { HistorialIncidenteRepository } from "../repositories/historial_incidente.repository";
import { RespuestaAPI, CrearHistorialIncidenteDTO, ActualizarHistorialIncidenteDTO } from "../models/historial_incidente.model";

export class HistorialIncidenteService {

    // Funciona para obtener todos los historiales pasándole el ID que requiere tu repositorio
    static async obtenerTodos(historialId: number = 0) {
        try {
            const historial = await HistorialIncidenteRepository.listarHistorialIncidente(historialId);
            return {
                success: true,
                message: "Historiales obtenidos correctamente",
                data: historial,
            };
        } catch (error: any) {
            return { success: false, message: "Error al obtener historiales", error: error.message };
        }
    }

    // Funciona para obtener un historial específico por su ID
    static async obtenerPorId(id: number) {
        try {
            const registro = await HistorialIncidenteRepository.buscarHistorialPorId(id);
            if (!registro) return { success: false, message: "Historial no encontrado" };
            return { success: true, message: "Historial encontrado", data: registro };
        } catch (error: any) {
            return { success: false, message: "Error al buscar historial", error: error.message };
        }
    }

    // Funciona para crear un nuevo registro usando agregarIncidente del repositorio
    static async crear(datos: CrearHistorialIncidenteDTO) {
        try {
            if (!datos.comentario || datos.comentario.trim().length === 0) {
                return { success: false, message: "El comentario no puede estar vacío" };
            }

            await HistorialIncidenteRepository.agregarIncidente(datos);
            return { success: true, message: "Historial creado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al crear historial", error: error.message };
        }
    }

    // Funciona para actualizar un historial existente usando actualizarIncidente del repositorio
    static async actualizar(id: number, datos: ActualizarHistorialIncidenteDTO): Promise<RespuestaAPI<any>> {
        try {
            const existe = await HistorialIncidenteRepository.buscarHistorialPorId(id);

            if (!existe) {
                return { success: false, message: "Historial no encontrado" };
            }

            if (datos.comentario !== undefined && datos.comentario.trim().length === 0) {
                return { success: false, message: "El comentario no puede estar vacío" };
            }

            await HistorialIncidenteRepository.actualizarIncidente(id, datos);
            return { success: true, message: "Historial actualizado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al actualizar historial", error: error.message };
        }
    }

    // Funciona para eliminar una entrada del historial
    static async eliminar(id: number): Promise<RespuestaAPI<any>> {
        try {
            const existe = await HistorialIncidenteRepository.buscarHistorialPorId(id);

            if (!existe) {
                return { success: false, message: "Historial no encontrado" };
            }

            await HistorialIncidenteRepository.eliminarHistorialIncidente(id);
            return { success: true, message: "Historial eliminado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al eliminar historial", error: error.message };
        }
    }
}