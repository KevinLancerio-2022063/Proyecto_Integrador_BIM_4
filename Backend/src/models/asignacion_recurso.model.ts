// Define la estructura principal de una asignacion de recurso
export interface AsignacionRecurso {
    id: number;
    recurso_id: number;
    nombre_recurso?: string;
    incidente_id?: number;
    refugio_id?: number;
    cantidad: number;
    estado: "SOLICITADO" | "ASIGNADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
    fecha_solicitud: Date;
    fecha_asignacion?: Date;
    fecha_entrega?: Date;
    usuario_asigna_id?: number;
    observaciones?: string;
    created_at: Date;
    updated_at?: Date;
}

// Define los datos necesarios para crear una asignacion de recurso
export interface CrearAsignacionRecursoDTO {
    recurso_id: number;
    cantidad: number;
    estado?: string;
    incidente_id?: number;
    refugio_id?: number;
    usuario_asigna_id?: number;
    observaciones?: string;
}

// Define los datos necesarios para actualizar una asignacion de recurso
export interface ActualizarAsignacionRecursoDTO {
    cantidad: number;
    estado: string;
    fecha_asignacion?: string;
    fecha_entrega?: string;
    observaciones?: string;
}

// Define la estructura estandar de respuesta de la API
export interface RespuestaAPI<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}