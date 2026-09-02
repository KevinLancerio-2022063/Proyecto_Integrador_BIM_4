// Define la estructura principal de un recurso
export interface Recurso {
  id: number;
  nombre: string;
  tipo: "AGUA" | "ALIMENTO" | "MEDICAMENTO" | "EQUIPO" | "VEHICULO" | "OTRO";
  unidad_medida: "UNIDAD" | "CAJA" | "KILOGRAMO" | "LITRO" | "PERSONA" | "OTRO";
  cantidad_total: number;
  descripcion?: string;
  activo: boolean;
  created_at: string;
  updated_at?: string;
}

// Define los datos necesarios para crear un recurso
export interface CrearRecursoDTO {
  nombre: string;
  tipo: string;
  unidad_medida?: string;
  cantidad_total?: number;
  descripcion?: string;
}

// Define la estructura estándar de respuesta de la API
export interface RespuestaAPI<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}