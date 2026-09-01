import { AsignacionRecursoRepository } from "../repositories/asignacion_recurso.repository";
import { RespuestaAPI, CrearAsignacionRecursoDTO, ActualizarAsignacionRecursoDTO } from "../models/asignacion_recurso.model";

export class AsignacionRecursoService {

    // Funciona para obtener todas las asignaciones de recursos
    static async obtenerTodas(): Promise<RespuestaAPI<any[]>> {
        try {
            const asignaciones = await AsignacionRecursoRepository.listarAsignaciones();
            return {
                success: true,
                message: "Asignaciones obtenidas correctamente",
                data: asignaciones,
            };
        } catch (error: any) {
            return { success: false, message: "Error al obtener asignaciones", error: error.message };
        }
    }

    // Funciona para obtener una asignacion especifica por su ID
    static async obtenerPorId(id: number): Promise<RespuestaAPI<any>> {
        try {
            const asignacion = await AsignacionRecursoRepository.buscarAsignacionPorId(id);
            if (!asignacion) return { success: false, message: "Asignacion no encontrada" };
            return { success: true, message: "Asignacion encontrada", data: asignacion };
        } catch (error: any) {
            return { success: false, message: "Error al buscar asignacion", error: error.message };
        }
    }

    // Funciona para crear una nueva asignacion de recurso con validaciones
    static async crear(datos: CrearAsignacionRecursoDTO): Promise<RespuestaAPI<any>> {
        try {
            // Validar que la cantidad sea mayor a cero
            if (datos.cantidad <= 0) {
                return { success: false, message: "La cantidad debe ser mayor a cero" };
            }

            // Validar que tenga un destino unico (incidente O refugio, no ambos)
            const tieneIncidente = datos.incidente_id !== undefined && datos.incidente_id !== null;
            const tieneRefugio = datos.refugio_id !== undefined && datos.refugio_id !== null;

            if (tieneIncidente && tieneRefugio) {
                return { success: false, message: "La asignacion debe tener un solo destino: incidente o refugio, no ambos" };
            }

            if (!tieneIncidente && !tieneRefugio) {
                return { success: false, message: "La asignacion debe tener un destino: incidente o refugio" };
            }

            await AsignacionRecursoRepository.agregarAsignacion(datos);
            return { success: true, message: "Asignacion de recurso creada correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al crear asignacion de recurso", error: error.message };
        }
    }

    // Funciona para actualizar una asignacion de recurso existente con validaciones
    static async actualizar(id: number, datos: ActualizarAsignacionRecursoDTO): Promise<RespuestaAPI<any>> {
        try {
            const existe = await AsignacionRecursoRepository.buscarAsignacionPorId(id);
            if (!existe) return { success: false, message: "Asignacion no encontrada" };

            // Validar que la cantidad sea mayor a cero
            if (datos.cantidad <= 0) {
                return { success: false, message: "La cantidad debe ser mayor a cero" };
            }

            // Validar estados permitidos
            const estadosPermitidos = ["SOLICITADO", "ASIGNADO", "ENVIADO", "ENTREGADO", "CANCELADO"];
            if (!estadosPermitidos.includes(datos.estado)) {
                return { success: false, message: "Estado no valido. Estados permitidos: SOLICITADO, ASIGNADO, ENVIADO, ENTREGADO, CANCELADO" };
            }

            await AsignacionRecursoRepository.actualizarAsignacion(id, datos);
            return { success: true, message: "Asignacion de recurso actualizada correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al actualizar asignacion de recurso", error: error.message };
        }
    }

    // Funciona para eliminar una asignacion de recurso (soft delete)
    static async eliminar(id: number): Promise<RespuestaAPI<any>> {
        try {
            const existe = await AsignacionRecursoRepository.buscarAsignacionPorId(id);
            if (!existe) return { success: false, message: "Asignacion no encontrada" };

            await AsignacionRecursoRepository.eliminarAsignacion(id);
            return { success: true, message: "Asignacion de recurso eliminada correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al eliminar asignacion de recurso", error: error.message };
        }
    }
}