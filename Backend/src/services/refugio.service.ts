import { RefugioRepository } from "../repositories/refugio.repository";
import { RespuestaAPI, CrearRefugioDTO, ActualizarRefugioDTO } from "../models/refugio.model";

export class RefugioService {

    // Funciona para obtener todos los refugios activos
    static async obtenerTodos(): Promise<RespuestaAPI<any[]>> {
        try {
            const refugios = await RefugioRepository.listarRefugios();
            return {
                success: true,
                message: "Refugios obtenidos correctamente",
                data: refugios,
            };
        } catch (error: any) {
            return { success: false, message: "Error al obtener refugios", error: error.message };
        }
    }

    // Funciona para obtener un refugio específico por su ID
    static async obtenerPorId(id: number): Promise<RespuestaAPI<any>> {
        try {
            const refugio = await RefugioRepository.buscarRefugioPorId(id);
            if (!refugio) return { success: false, message: "Refugio no encontrado" };
            return { success: true, message: "Refugio encontrado", data: refugio };
        } catch (error: any) {
            return { success: false, message: "Error al buscar refugio", error: error.message };
        }
    }

    // Funciona para crear un nuevo refugio con validaciones
    static async crear(datos: CrearRefugioDTO): Promise<RespuestaAPI<any>> {
        try {
            if (datos.capacidad_total <= 0) {
                return { success: false, message: "La capacidad total debe ser mayor a 0" };
            }

            await RefugioRepository.agregarRefugio(datos);
            return { success: true, message: "Refugio creado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al crear refugio", error: error.message };
        }
    }

    // Funciona para actualizar un refugio existente con validaciones
    static async actualizar(id: number, datos: ActualizarRefugioDTO): Promise<RespuestaAPI<any>> {
        try {
            const existe = await RefugioRepository.buscarRefugioPorId(id);
            if (!existe) return { success: false, message: "Refugio no encontrado" };

            if (datos.ocupacion_actual > datos.capacidad_total) {
                return { success: false, message: "La ocupación no puede exceder la capacidad total" };
            }

            if (datos.capacidad_total <= 0) {
                return { success: false, message: "La capacidad total debe ser mayor a 0" };
            }

            await RefugioRepository.actualizarRefugio(id, datos);
            return { success: true, message: "Refugio actualizado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al actualizar refugio", error: error.message };
        }
    }

    // Funciona para eliminar un refugio (soft delete)
    static async eliminar(id: number): Promise<RespuestaAPI<any>> {
        try {
            const existe = await RefugioRepository.buscarRefugioPorId(id);
            if (!existe) return { success: false, message: "Refugio no encontrado" };

            await RefugioRepository.eliminarRefugio(id);
            return { success: true, message: "Refugio eliminado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al eliminar refugio", error: error.message };
        }
    }
}