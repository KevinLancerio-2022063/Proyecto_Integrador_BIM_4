// Define la estructura principal de una asignación de recurso
export interface AsignacionRecurso {
  id: number;
  recurso_id: number;
  nombre_recurso?: string;
  incidente_id?: number;
  refugio_id?: number;
  cantidad: number;
  estado: "SOLICITADO" | "ASIGNADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
  fecha_solicitud: string;
  fecha_asignacion?: string;
  fecha_entrega?: string;
  usuario_asigna_id?: number;
  observaciones?: string;
  created_at: string;
  updated_at?: string;
}

// Define los datos necesarios para crear una asignación
export interface CrearAsignacionDTO {
  recurso_id: number;
  cantidad: number;
  estado?: string;
  incidente_id?: number;
  refugio_id?: number;
  usuario_asigna_id?: number;
  observaciones?: string;
}

// Define la estructura estándar de respuesta de la API
export interface RespuestaAPI<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}