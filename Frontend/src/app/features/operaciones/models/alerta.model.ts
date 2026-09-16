export interface Alerta {
    id: number;
    incidente_id?: number;
    zona_id?: number;
    refugio_id?: number;
    tipo: "Emergencia" | "Recurso" | "Refugio" | "Seguimiento" | "Otro";
    nivel: "Informacion" | "Advertencia" | "Critico";
    mensaje: string;
    estado: "Activa" | "Leida" | "Resuelta";
    fecha: Date;
};

// Datos necesarios para crear una alerta
export interface CrearAlertaDTO {
    incidente_id?: number;
    zona_id?: number;
    refugio_id?: number;
    tipo: string;
    nivel: string;
    mensaje: string;
}

// Respuesta estándar de la API
export interface RespuestaAlertaAPI<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}