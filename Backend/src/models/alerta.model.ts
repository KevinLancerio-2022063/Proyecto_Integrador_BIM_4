import { Tipo } from './tipo.model';
import { Nivel } from './nivel.model';
import { Estado } from './estado.model';

export interface Alerta {
    id: number;
    incidente_id?: number;
    zona_id?: number;
    refugio_id?: number;
    tipo: Tipo;
    nivel: Nivel;
    mensaje: string;
    estado: Estado;
    fecha: Date;
};

// Datos necesarios para crear una alerta
export interface CrearAlertaDTO {
    incidente_id?: number;
    zona_id?: number;
    refugio_id?: number;
    tipo: Tipo;
    nivel: Nivel;
    mensaje: string;
}

// Datos necesarios para actualizar una alerta
export interface ActualizarAlertaDTO {
    id: number;
    estado?: Estado;
}

// Respuesta estándar de la API
export interface RespuestaAlertaAPI<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}