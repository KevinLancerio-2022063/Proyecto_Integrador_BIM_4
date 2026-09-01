import { CrearIncidenteDTO, ActualizarIncidenteDTO } from "../models/incidente.model";

// Tipos válidos para incidente
const TIPOS_INCIDENTE = ["INCENDIO", "INUNDACION", "TERREMOTO", "DESLIZAMIENTO", "ACCIDENTE", "OTRO"];

// Niveles de emergencia válidos
const NIVELES_EMERGENCIA = ["BAJA", "MEDIA", "ALTA", "CRITICA"];

// Estados válidos para incidente
const ESTADOS_INCIDENTE = ["PENDIENTE", "EN_PROCESO", "RESUELTO", "CANCELADO"];

// Valida los datos para crear un incidente
export function validarCrearIncidente(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar tipo
    if (!datos.tipo || typeof datos.tipo !== "string") {
        errores.push("El tipo de incidente es obligatorio");
    } else if (!TIPOS_INCIDENTE.includes(datos.tipo)) {
        errores.push(`El tipo debe ser uno de: ${TIPOS_INCIDENTE.join(", ")}`);
    }

    // Validar titulo
    if (!datos.titulo || typeof datos.titulo !== "string") {
        errores.push("El título es obligatorio y debe ser texto");
    } else if (datos.titulo.trim().length === 0) {
        errores.push("El título no puede estar vacío");
    } else if (datos.titulo.length > 150) {
        errores.push("El título no puede exceder 150 caracteres");
    }

    // Validar descripcion
    if (!datos.descripcion || typeof datos.descripcion !== "string") {
        errores.push("La descripción es obligatoria y debe ser texto");
    } else if (datos.descripcion.trim().length === 0) {
        errores.push("La descripción no puede estar vacía");
    }

    // Validar nivel de emergencia
    if (!datos.nivel_emergencia || typeof datos.nivel_emergencia !== "string") {
        errores.push("El nivel de emergencia es obligatorio");
    } else if (!NIVELES_EMERGENCIA.includes(datos.nivel_emergencia)) {
        errores.push(`El nivel de emergencia debe ser uno de: ${NIVELES_EMERGENCIA.join(", ")}`);
    }

    // Validar zona id
    if (datos.zona_id === undefined || datos.zona_id === null) {
        errores.push("El ID de la zona es obligatorio");
    } else if (typeof datos.zona_id !== "number") {
        errores.push("El ID de la zona debe ser un número");
    }

    // Validar reportado por id
    if (datos.reportado_por === undefined || datos.reportado_por === null) {
        errores.push("El ID del usuario que reporta es obligatorio");
    } else if (typeof datos.reportado_por !== "number") {
        errores.push("El ID del usuario que reporta debe ser un número");
    }

    // Validar cantidad de personas afectadas
    if (datos.cantidad_personas_afectadas !== undefined && datos.cantidad_personas_afectadas !== null) {
        if (typeof datos.cantidad_personas_afectadas !== "number") {
            errores.push("La cantidad de personas afectadas debe ser un número");
        } else if (datos.cantidad_personas_afectadas < 0) {
            errores.push("La cantidad de personas afectadas no puede ser negativa");
        }
    }

    // Validar observaciones
    if (datos.observaciones !== undefined && datos.observaciones !== null) {
        if (typeof datos.observaciones !== "string") {
            errores.push("Las observaciones deben ser texto");
        } else if (datos.observaciones.length > 1000) {
            errores.push("Las observaciones no pueden exceder 1000 caracteres");
        }
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}

// Valida los datos para actualizar un incidente
export function validarActualizarIncidente(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar tipo
    if (!datos.tipo || typeof datos.tipo !== "string") {
        errores.push("El tipo de incidente es obligatorio");
    } else if (!TIPOS_INCIDENTE.includes(datos.tipo)) {
        errores.push(`El tipo debe ser uno de: ${TIPOS_INCIDENTE.join(", ")}`);
    }

    // Validar titulo
    if (!datos.titulo || typeof datos.titulo !== "string") {
        errores.push("El título es obligatorio");
    } else if (datos.titulo.trim().length === 0) {
        errores.push("El título no puede estar vacío");
    } else if (datos.titulo.length > 150) {
        errores.push("El título no puede exceder 150 caracteres");
    }

    // Validar descripcion
    if (!datos.descripcion || typeof datos.descripcion !== "string") {
        errores.push("La descripción es obligatoria");
    } else if (datos.descripcion.trim().length === 0) {
        errores.push("La descripción no puede estar vacía");
    }

    // Validar nivel de emergencia
    if (!datos.nivel_emergencia || typeof datos.nivel_emergencia !== "string") {
        errores.push("El nivel de emergencia es obligatorio");
    } else if (!NIVELES_EMERGENCIA.includes(datos.nivel_emergencia)) {
        errores.push(`El nivel de emergencia debe ser uno de: ${NIVELES_EMERGENCIA.join(", ")}`);
    }

    // Validar estado
    if (!datos.estado || typeof datos.estado !== "string") {
        errores.push("El estado es obligatorio");
    } else if (!ESTADOS_INCIDENTE.includes(datos.estado)) {
        errores.push(`El estado debe ser uno de: ${ESTADOS_INCIDENTE.join(", ")}`);
    }

    // Validar cantidad de personas afectadas
    if (datos.cantidad_personas_afectadas === undefined || datos.cantidad_personas_afectadas === null) {
        errores.push("La cantidad de personas afectadas es obligatoria");
    } else if (typeof datos.cantidad_personas_afectadas !== "number") {
        errores.push("La cantidad de personas afectadas debe ser un número");
    } else if (datos.cantidad_personas_afectadas < 0) {
        errores.push("La cantidad de personas afectadas no puede ser negativa");
    }

    // Validar observaciones
    if (datos.observaciones !== undefined && datos.observaciones !== null) {
        if (typeof datos.observaciones !== "string") {
            errores.push("Las observaciones deben ser texto");
        } else if (datos.observaciones.length > 1000) {
            errores.push("Las observaciones no pueden exceder 1000 caracteres");
        }
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}