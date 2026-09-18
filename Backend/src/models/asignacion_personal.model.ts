import { RolAsignado } from './rol_asignado.model';
import { EstadoAsignacion } from './estado_asignacion.model';

export interface AsignacionPersonal {
    id: number;
    usuario_id: number;
    incidente_id?: number;
    refugio_id?: number;
    rol_asignado: RolAsignado;
    estado: EstadoAsignacion;
    fecha_asignacion: Date;
    fecha_finalizacion?: Date;
    observaciones?: string;
    created_at: Date;
    updated_at?: Date;
}

// Datos necesarios para crear una asignación
export interface CrearAsignacionPersonalDTO {
    usuario_id: number;
    incidente_id?: number;
    refugio_id?: number;
    rol_asignado?: RolAsignado;
    estado?: EstadoAsignacion;
    fecha_asignacion?: Date;
    observaciones?: string;
}

// Datos necesarios para actualizar una asignación
export interface ActualizarAsignacionPersonalDTO {
    usuario_id?: number;
    incidente_id?: number | null;
    refugio_id?: number | null;
    rol_asignado?: RolAsignado;
    estado?: EstadoAsignacion;
    fecha_finalizacion?: Date | null;
    observaciones?: string | null;
}

// Respuesta estándar de la API
export interface RespuestaAsignacionPersonalAPI<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}