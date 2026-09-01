import { IncidenteRepository } from "../repositories/incidente.repository";
import { CrearIncidenteDTO, ActualizarIncidenteDTO } from "../models/incidente.model";

export class IncidenteService {

    // Funciona para obtener todos los incidentes
    static async obtenerTodos() {
        try {
            const incidentes = await IncidenteRepository.listarIncidentes();
            return {
                success: true,
                message: "Incidentes obtenidos correctamente",
                data: incidentes,
            };
        } catch (error: any) {
            return { success: false, message: "Error al obtener incidentes", error: error.message };
        }
    }

    // Funciona para obtener un incidente específico por su ID
    static async obtenerPorId(id: number) {
        try {
            const incidente = await IncidenteRepository.buscarIncidentePorId(id);
            if (!incidente) return { success: false, message: "Incidente no encontrado" };
            return { success: true, message: "Incidente encontrado", data: incidente };
        } catch (error: any) {
            return { success: false, message: "Error al buscar incidente", error: error.message };
        }
    }

    // Funciona para crear un nuevo incidente con validaciones
    static async crear(datos: CrearIncidenteDTO) {
        try {
            if (datos.cantidad_personas_afectadas !== undefined && datos.cantidad_personas_afectadas < 0) {
                return { success: false, message: "La cantidad de personas afectadas no puede ser negativa" };
            }

            await IncidenteRepository.agregarIncidente(datos);
            return { success: true, message: "Incidente creado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al crear incidente", error: error.message };
        }
    }

    // Funciona para actualizar un incidente existente con validaciones
    static async actualizar(id: number, datos: ActualizarIncidenteDTO) {
        try {
            const existe = await IncidenteRepository.buscarIncidentePorId(id);
            if (!existe) return { success: false, message: "Incidente no encontrado" };

            if (datos.cantidad_personas_afectadas !== undefined && datos.cantidad_personas_afectadas < 0) {
                return { success: false, message: "La cantidad de personas afectadas no puede ser negativa" };
            }

            await IncidenteRepository.actualizarIncidente(id, datos);
            return { success: true, message: "Incidente actualizado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al actualizar incidente", error: error.message };
        }
    }

    // Funciona para eliminar un incidente
    static async eliminar(id: number) {
        try {
            const existe = await IncidenteRepository.buscarIncidentePorId(id);
            if (!existe) return { success: false, message: "Incidente no encontrado" };

            await IncidenteRepository.eliminarIncidente(id);
            return { success: true, message: "Incidente eliminado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al eliminar incidente", error: error.message };
        }
    }
}