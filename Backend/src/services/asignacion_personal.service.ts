import { AsignacionPersonalRepository } from '../repositories/asignacion_personal.repository';
import {
    RespuestaAsignacionPersonalAPI,
    CrearAsignacionPersonalDTO,
    ActualizarAsignacionPersonalDTO,
} from '../models/asignacion_personal.model';

export class AsignacionPersonalService {

    // Obtener todas las asignaciones
    static async obtenerTodos(): Promise<RespuestaAsignacionPersonalAPI<any[]>> {
        try {
            const asignaciones =
                await AsignacionPersonalRepository.listarAsignaciones();

            return {
                success: true,
                message: 'Asignaciones obtenidas correctamente',
                data: asignaciones,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al obtener asignaciones',
                error: error.message,
            };
        }
    }

    // Obtener una asignación por ID
    static async obtenerPorId(
        id: number,
    ): Promise<RespuestaAsignacionPersonalAPI<any>> {
        try {
            const asignacion =
                await AsignacionPersonalRepository.buscarAsignacionPorId(id);

            if (!asignacion) {
                return {
                    success: false,
                    message: 'Asignación no encontrada',
                };
            }

            return {
                success: true,
                message: 'Asignación encontrada',
                data: asignacion,
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al buscar asignación',
                error: error.message,
            };
        }
    }

    // Crear una asignación
    static async crear(
        datos: CrearAsignacionPersonalDTO,
    ): Promise<RespuestaAsignacionPersonalAPI<any>> {
        try {
            const tieneIncidente = datos.incidente_id !== undefined;
            const tieneRefugio = datos.refugio_id !== undefined;

            if (tieneIncidente === tieneRefugio) {
                return {
                    success: false,
                    message:
                        'Debe asignarse exactamente un incidente o un refugio',
                };
            }

            await AsignacionPersonalRepository.agregarAsignacion(datos);

            return {
                success: true,
                message: 'Asignación creada correctamente',
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al crear asignación',
                error: error.message,
            };
        }
    }

    // Actualizar una asignación
    static async actualizar(
        id: number,
        datos: ActualizarAsignacionPersonalDTO,
    ): Promise<RespuestaAsignacionPersonalAPI<any>> {
        try {
            const existe =
                await AsignacionPersonalRepository.buscarAsignacionPorId(id);

            if (!existe) {
                return {
                    success: false,
                    message: 'Asignación no encontrada',
                };
            }

            const incidenteId =
                datos.incidente_id !== undefined
                    ? datos.incidente_id
                    : existe.incidente_id;

            const refugioId =
                datos.refugio_id !== undefined
                    ? datos.refugio_id
                    : existe.refugio_id;

            if (
                (incidenteId === null || incidenteId === undefined) ===
                (refugioId === null || refugioId === undefined)
            ) {
                return {
                    success: false,
                    message:
                        'Debe existir exactamente un incidente o un refugio',
                };
            }

            await AsignacionPersonalRepository.actualizarAsignacion(
                id,
                datos,
            );

            return {
                success: true,
                message: 'Asignación actualizada correctamente',
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al actualizar asignación',
                error: error.message,
            };
        }
    }

    // Cancelar una asignación
    static async eliminar(
        id: number,
    ): Promise<RespuestaAsignacionPersonalAPI<any>> {
        try {
            const existe =
                await AsignacionPersonalRepository.buscarAsignacionPorId(id);

            if (!existe) {
                return {
                    success: false,
                    message: 'Asignación no encontrada',
                };
            }

            await AsignacionPersonalRepository.eliminarAsignacion(id);

            return {
                success: true,
                message: 'Asignación cancelada correctamente',
            };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al cancelar asignación',
                error: error.message,
            };
        }
    }
}