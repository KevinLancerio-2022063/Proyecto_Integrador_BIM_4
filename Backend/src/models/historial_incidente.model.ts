export interface HistorialIncidente {
  id: number;
  incidente_id: number;
  estado_anterior?: string;
  estado_nuevo: 'REPORTADO' | 'EN_ATENCION' | 'MITIGADO' | 'CERRADO';
  comentario?: string;
  usuario_id?: number;
  fecha: Date;
}

export interface CrearHistorialIncidenteDTO {
  incidente_id: number;
  estado_anterior?: string;
  estado_nuevo: string;
  comentario?: string;
  usuario_id?: number;
}

// Define la estructura estándar de respuesta de la API
export interface RespuestaAPI<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}