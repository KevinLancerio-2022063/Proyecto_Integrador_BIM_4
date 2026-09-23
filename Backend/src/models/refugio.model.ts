// Define la estructura principal de un refugio
export interface Refugio {
    id: number;
    nombre: string;
    direccion?: string;
    zona_id?: number;
    latitud?: number;
    longitud?: number;
    capacidad_total: number;
    ocupacion_actual: number;
    estado: "DISPONIBLE" | "PARCIAL" | "LLENO" | "INACTIVO";
    responsable_id?: number;
    telefono_contacto?: string;
    observaciones?: string;
    activo: boolean;
    created_at: Date;
    updated_at?: Date;
}

// Define los datos necesarios para crear un refugio
export interface CrearRefugioDTO {
    nombre: string;
    capacidad_total: number;
    direccion?: string;
    zona_id?: number;
    latitud?: number;
    longitud?: number;
    responsable_id?: number;
    telefono_contacto?: string;
}

// Define los datos necesarios para actualizar un refugio
export interface ActualizarRefugioDTO {
    nombre: string;
    direccion: string;
    zona_id: number;
    latitud: number;
    longitud: number;
    capacidad_total: number;
    ocupacion_actual: number;
    estado: string;
    responsable_id: number;
    telefono_contacto: string;
    observaciones: string;
}

// Define la estructura estándar de respuesta de la API
export interface RespuestaAPI<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}