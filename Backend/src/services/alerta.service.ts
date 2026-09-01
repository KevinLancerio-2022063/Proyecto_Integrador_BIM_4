import { AlertaRepository } from '../repositories/alerta.repository';
import {
    RespuestaAlertaAPI,
    CrearAlertaDTO,
    ActualizarAlertaDTO,
} from '../models/alerta.model';

export class AlertaService {

    // Obtener todas las alertas
    static async obtenerTodos(): Promise<RespuestaAlertaAPI<any[]>> {
        try {
            const alertas = await AlertaRepository.listarAlertas();

            return {
                success: true,
                message: 'Alertas obtenidas correctamente',
                data: alertas,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al obtener alertas',
                error: error.message,
            };
        }
    }

    // Obtener una alerta por ID
    static async obtenerPorId(
        id: number,
    ): Promise<RespuestaAlertaAPI<any>> {
        try {
            const alerta = await AlertaRepository.buscarAlertaPorId(id);

            if (!alerta) {
                return {
                    success: false,
                    message: 'Alerta no encontrada',
                };
            }

            return {
                success: true,
                message: 'Alerta encontrada',
                data: alerta,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al buscar alerta',
                error: error.message,
            };
        }
    }

    // Crear una alerta
    static async crear(
        datos: CrearAlertaDTO,
    ): Promise<RespuestaAlertaAPI<any>> {
        try {
            const tieneIncidente = datos.incidente_id !== undefined;
            const tieneZona = datos.zona_id !== undefined;
            const tieneRefugio = datos.refugio_id !== undefined;

            if (!tieneIncidente && !tieneZona && !tieneRefugio) {
                return {
                    success: false,
                    message:
                        'La alerta debe estar relacionada con un incidente, zona o refugio',
                };
            }

            await AlertaRepository.agregarAlerta(datos);

            return {
                success: true,
                message: 'Alerta creada correctamente',
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al crear alerta',
                error: error.message,
            };
        }
    }

    // Actualizar una alerta
    static async actualizar(
        id: number,
        datos: ActualizarAlertaDTO,
    ): Promise<RespuestaAlertaAPI<any>> {
        try {
            const existe = await AlertaRepository.buscarAlertaPorId(id);

            if (!existe) {
                return {
                    success: false,
                    message: 'Alerta no encontrada',
                };
            }

            const incidenteId =
                datos.incidente_id !== undefined
                    ? datos.incidente_id
                    : existe.incidente_id;

            const zonaId =
                datos.zona_id !== undefined
                    ? datos.zona_id
                    : existe.zona_id;

            const refugioId =
                datos.refugio_id !== undefined
                    ? datos.refugio_id
                    : existe.refugio_id;

            if (
                incidenteId === null &&
                zonaId === null &&
                refugioId === null
            ) {
                return {
                    success: false,
                    message:
                        'La alerta debe tener al menos un destino',
                };
            }

            await AlertaRepository.actualizarAlerta(id, datos);

            return {
                success: true,
                message: 'Alerta actualizada correctamente',
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al actualizar alerta',
                error: error.message,
            };
        }
    }

    // Marcar una alerta como resuelta
    static async eliminar(
        id: number,
    ): Promise<RespuestaAlertaAPI<any>> {
        try {
            const existe = await AlertaRepository.buscarAlertaPorId(id);

            if (!existe) {
                return {
                    success: false,
                    message: 'Alerta no encontrada',
                };
            }

            await AlertaRepository.eliminarAlerta(id);

            return {
                success: true,
                message: 'Alerta eliminada correctamente',
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al eliminar alerta',
                error: error.message,
            };
        }
    }
}