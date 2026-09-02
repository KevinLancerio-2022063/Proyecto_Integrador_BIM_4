// Interfaz principal basada en la tabla 'incidente'
export interface Incidente {
  id: number;
  tipo: 'INUNDACION' | 'TERREMOTO' | 'INCENDIO' | 'DESLIZAMIENTO' | 'ACTIVIDAD_VOLCANICA' | 'OTRO';
  titulo: string;
  descripcion?: string;
  nivel_emergencia: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  estado: 'REPORTADO' | 'EN_ATENCION' | 'MITIGADO' | 'CERRADO';
  fecha_reporte: Date;
  fecha_cierre?: Date;
  zona_id: number;
  reportado_por: number;
  latitud?: number;
  longitud?: number;
  cantidad_personas_afectadas?: number;
  observaciones?: string;
  created_at: Date;
  updated_at?: Date;
}

// DTO para crear (lo que envía el frontend)
export interface CrearIncidenteDTO {
  tipo: string;
  titulo: string;
  descripcion?: string;
  nivel_emergencia?: string;
  zona_id: number;
  reportado_por: number;
  latitud?: number;
  longitud?: number;
  cantidad_personas_afectadas?: number;
  observaciones?: string;
}

// DTO para actualizar
export interface ActualizarIncidenteDTO {
  tipo?: string;
  titulo?: string;
  descripcion?: string;
  nivel_emergencia?: string;
  estado?: string;
  fecha_cierre?: Date;
  latitud?: number;
  longitud?: number;
  cantidad_personas_afectadas?: number;
  observaciones?: string;
}

export interface RespuestaAPI<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}