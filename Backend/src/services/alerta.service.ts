import { AlertaRepository } from '../repositories/alerta.repository';
import {
    RespuestaAlertaAPI,
    CrearAlertaDTO,
    ActualizarAlertaDTO,
} from '../models/alerta.model';

const TIPOS_VALIDOS = ['EMERGENCIA', 'RECURSO', 'REFUGIO', 'SEGUIMIENTO', 'OTRO'];
const NIVELES_VALIDOS = ['INFO', 'ADVERTENCIA', 'CRITICA'];
const ESTADOS_VALIDOS = ['ACTIVA', 'LEIDA', 'RESUELTA'];

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
    static async obtenerPorId(id: number): Promise<RespuestaAlertaAPI<any>> {
        try {
            const alerta = await AlertaRepository.buscarAlertaPorId(id);

            if (!alerta) {
                return { success: false, message: 'Alerta no encontrada' };
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
    static async crear(datos: CrearAlertaDTO): Promise<RespuestaAlertaAPI<any>> {
        try {
            // Campos obligatorios no vacíos
            if (!datos.tipo || datos.tipo.trim() === '') {
                return { success: false, message: 'El campo tipo es obligatorio' };
            }
            if (!datos.nivel || datos.nivel.trim() === '') {
                return { success: false, message: 'El campo nivel es obligatorio' };
            }
            if (!datos.mensaje || datos.mensaje.trim() === '') {
                return { success: false, message: 'El campo mensaje es obligatorio' };
            }

            // Valores permitidos (coinciden con los CHECK de la tabla)
            if (!TIPOS_VALIDOS.includes(datos.tipo)) {
                return {
                    success: false,
                    message: `El tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}`,
                };
            }
            if (!NIVELES_VALIDOS.includes(datos.nivel)) {
                return {
                    success: false,
                    message: `El nivel debe ser uno de: ${NIVELES_VALIDOS.join(', ')}`,
                };
            }

            const tieneIncidente = datos.incidente_id != null;
            const tieneZona = datos.zona_id != null;
            const tieneRefugio = datos.refugio_id != null;

            if (!tieneIncidente && !tieneZona && !tieneRefugio) {
                return {
                    success: false,
                    message:
                        'La alerta debe estar relacionada con un incidente, zona o refugio',
                };
            }

            if (tieneIncidente) {
                const existe = await AlertaRepository.existeIncidente(datos.incidente_id as number);
                if (!existe) {
                    return { success: false, message: `El incidente con id ${datos.incidente_id} no existe` };
                }
            }

            if (tieneZona) {
                const existe = await AlertaRepository.existeZona(datos.zona_id as number);
                if (!existe) {
                    return { success: false, message: `La zona con id ${datos.zona_id} no existe` };
                }
            }

            if (tieneRefugio) {
                const existe = await AlertaRepository.existeRefugio(datos.refugio_id as number);
                if (!existe) {
                    return { success: false, message: `El refugio con id ${datos.refugio_id} no existe` };
                }
            }

            await AlertaRepository.agregarAlerta(datos);

            return { success: true, message: 'Alerta creada correctamente' };
        } catch (error: any) {
            if (error.code === '23503') {
                const constraintMap: Record<string, string> = {
                    alerta_incidente_id_fkey: 'El incidente indicado no existe',
                    alerta_zona_id_fkey: 'La zona indicada no existe',
                    alerta_refugio_id_fkey: 'El refugio indicado no existe',
                };
                return {
                    success: false,
                    message: constraintMap[error.constraint] ?? 'Referencia inválida',
                };
            }
            if (error.code === '23514') { // check_violation
                return { success: false, message: 'Uno de los valores enviados no es válido' };
            }

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
                return { success: false, message: 'Alerta no encontrada' };
            }

            if (!datos.estado || datos.estado.trim() === '') {
                return { success: false, message: 'El campo estado es obligatorio' };
            }

            if (!ESTADOS_VALIDOS.includes(datos.estado)) {
                return {
                    success: false,
                    message: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`,
                };
            }

            await AlertaRepository.actualizarAlerta(id, datos);

            return { success: true, message: 'Alerta actualizada correctamente' };
        } catch (error: any) {
            if (error.code === '23514') {
                return { success: false, message: 'El estado enviado no es válido' };
            }

            return {
                success: false,
                message: 'Error al actualizar alerta',
                error: error.message,
            };
        }
    }

    // Marcar una alerta como resuelta
    static async eliminar(id: number): Promise<RespuestaAlertaAPI<any>> {
        try {
            const existe = await AlertaRepository.buscarAlertaPorId(id);

            if (!existe) {
                return { success: false, message: 'Alerta no encontrada' };
            }

            await AlertaRepository.eliminarAlerta(id);

            return { success: true, message: 'Alerta eliminada correctamente' };
        } catch (error: any) {
            return {
                success: false,
                message: 'Error al eliminar alerta',
                error: error.message,
            };
        }
    }
}