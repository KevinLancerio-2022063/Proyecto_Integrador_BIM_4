import { AsignacionPersonalRepository } from '../repositories/asignacion_personal.repository';
import {
    RespuestaAsignacionPersonalAPI,
    CrearAsignacionPersonalDTO,
    ActualizarAsignacionPersonalDTO,
} from '../models/asignacion_personal.model';

const ROLES_VALIDOS = ['COORDINACION', 'RESCATE', 'APOYO', 'LOGISTICA', 'GESTION_REFUGIO'];
const ESTADOS_VALIDOS = ['ASIGNADO', 'EN_CAMINO', 'ACTIVO', 'FINALIZADO', 'CANCELADO'];

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
            // usuario_id: obligatorio y debe ser un número válido
            if (
                datos.usuario_id == null ||
                typeof datos.usuario_id !== 'number' ||
                isNaN(datos.usuario_id)
            ) {
                return {
                    success: false,
                    message: 'El usuario_id es obligatorio y debe ser numérico',
                };
            }

            // rol_asignado: si viene, no puede estar vacío ni ser inválido
            if (datos.rol_asignado != null) {
                if (
                    typeof datos.rol_asignado !== 'string' ||
                    datos.rol_asignado.trim() === ''
                ) {
                    return {
                        success: false,
                        message: 'El rol_asignado no puede estar vacío',
                    };
                }
                if (!ROLES_VALIDOS.includes(datos.rol_asignado)) {
                    return {
                        success: false,
                        message: `El rol_asignado debe ser uno de: ${ROLES_VALIDOS.join(', ')}`,
                    };
                }
            }

            // estado: si viene, no puede estar vacío ni ser inválido
            if (datos.estado != null) {
                if (
                    typeof datos.estado !== 'string' ||
                    datos.estado.trim() === ''
                ) {
                    return {
                        success: false,
                        message: 'El estado no puede estar vacío',
                    };
                }
                if (!ESTADOS_VALIDOS.includes(datos.estado)) {
                    return {
                        success: false,
                        message: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`,
                    };
                }
            }

            const tieneIncidente = datos.incidente_id != null;
            const tieneRefugio = datos.refugio_id != null;

            if (tieneIncidente === tieneRefugio) {
                return {
                    success: false,
                    message: 'Debe asignarse exactamente un incidente o un refugio',
                };
            }

            const existeUsuario = await AsignacionPersonalRepository.existeUsuario(
                datos.usuario_id,
            );
            if (!existeUsuario) {
                return {
                    success: false,
                    message: `El usuario con id ${datos.usuario_id} no existe`,
                };
            }

            if (tieneIncidente) {
                const existe = await AsignacionPersonalRepository.existeIncidente(
                    datos.incidente_id as number,
                );
                if (!existe) {
                    return {
                        success: false,
                        message: `El incidente con id ${datos.incidente_id} no existe`,
                    };
                }
            }

            if (tieneRefugio) {
                const existe = await AsignacionPersonalRepository.existeRefugio(
                    datos.refugio_id as number,
                );
                if (!existe) {
                    return {
                        success: false,
                        message: `El refugio con id ${datos.refugio_id} no existe`,
                    };
                }
            }

            await AsignacionPersonalRepository.agregarAsignacion(datos);

            return {
                success: true,
                message: 'Asignación creada correctamente',
            };
        } catch (error: any) {
            if (error.code === '23503') {
                const constraintMap: Record<string, string> = {
                    asignacion_personal_usuario_id_fkey: 'El usuario indicado no existe',
                    asignacion_personal_incidente_id_fkey: 'El incidente indicado no existe',
                    asignacion_personal_refugio_id_fkey: 'El refugio indicado no existe',
                };
                return {
                    success: false,
                    message: constraintMap[error.constraint] ?? 'Referencia inválida',
                };
            }
            if (error.code === '23514') {
                return {
                    success: false,
                    message: 'Uno de los valores enviados no es válido',
                };
            }
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

            if (
                typeof datos.rol_asignado !== 'string' ||
                datos.rol_asignado.trim() === ''
            ) {
                return {
                    success: false,
                    message: 'El campo rol_asignado es obligatorio y no puede estar vacío',
                };
            }

            if (
                typeof datos.estado !== 'string' ||
                datos.estado.trim() === ''
            ) {
                return {
                    success: false,
                    message: 'El campo estado es obligatorio y no puede estar vacío',
                };
            }

            if (!ROLES_VALIDOS.includes(datos.rol_asignado)) {
                return {
                    success: false,
                    message: `El rol_asignado debe ser uno de: ${ROLES_VALIDOS.join(', ')}`,
                };
            }

            if (!ESTADOS_VALIDOS.includes(datos.estado)) {
                return {
                    success: false,
                    message: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`,
                };
            }

            await AsignacionPersonalRepository.actualizarAsignacion(id, datos);

            return {
                success: true,
                message: 'Asignación actualizada correctamente',
            };
        } catch (error: any) {
            if (error.code === '23514') {
                return {
                    success: false,
                    message: 'El rol_asignado o estado enviado no es válido',
                };
            }
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