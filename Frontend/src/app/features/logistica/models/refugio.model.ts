// Define la estructura principal de un refugio
export interface Refugio {
  id: number;
  nombre: string;
  direccion?: string | null;
  zona_id?: number | null;
  latitud?: number | null;
  longitud?: number | null;
  capacidad_total: number;
  ocupacion_actual: number;
  estado: "DISPONIBLE" | "PARCIAL" | "LLENO" | "INACTIVO";
  responsable_id?: number | null;
  telefono_contacto?: string | null;
  observaciones?: string | null;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

// Define los datos necesarios para crear un refugio
export interface CrearRefugioDTO {
  nombre: string;
  capacidad_total: number;
  ocupacion_actual: number;
  estado: string;
  direccion?: string | null;
  zona_id?: number | null;
  latitud?: number | null;
  longitud?: number | null;
  responsable_id?: number | null;
  telefono_contacto?: string | null;
  observaciones?: string | null;
}

// Define los datos necesarios para actualizar un refugio
export interface ActualizarRefugioDTO extends CrearRefugioDTO {
  id: number;
}

// Define la estructura estandar de respuesta de la API
export interface RespuestaAPI<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}