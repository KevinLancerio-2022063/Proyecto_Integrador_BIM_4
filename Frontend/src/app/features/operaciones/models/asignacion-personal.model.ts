export interface AsignacionPersonal {
    id: number;
    usuario_id: number;
    incidente_id?: number;
    refugio_id?: number;
    rol_asignado: "Coordinacion" | "Rescate" | "Apoyo" | "Logistica" | "Gestion_refugio";
    estado: "Asignado" | "En_camino" | "Activo" | "Finalizado" | "Cancelado";
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
    rol_asignado?: string;
    estado?: string;
    fecha_asignacion?: Date;
    observaciones?: string;
}

// Respuesta estándar de la API
export interface RespuestaAsignacionPersonalAPI<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}