import { HistorialIncidenteRepository } from "../repositories/historial_incidente.repository";
import { RespuestaAPI } from "../models/historial_incidente.model";
import { CrearHistorialIncidenteDTO } from "../models/historial_incidente.model";

export class HistorialIncidenteService {

    static async obtenerPorIncidenteId(incidenteId: number): Promise<RespuestaAPI<any[]>> {
        try {
            const historial = await HistorialIncidenteRepository.obtenerHistorialPorIncidente(incidenteId);
            return {
                success: true,
                message: "Historial obtenido correctamente",
                data: historial,
            };
        } catch (error: any) {
            return { success: false, message: "Error al obtener el historial", error: error.message };
        }
    }

    static async crear(datos: CrearHistorialIncidenteDTO): Promise<RespuestaAPI<any>> {
        try {
            await HistorialIncidenteRepository.agregarHistorial(datos);
            return { success: true, message: "Historial registrado correctamente" };
        } catch (error: any) {
            return { success: false, message: "Error al registrar el historial", error: error.message };
        }
    }
}