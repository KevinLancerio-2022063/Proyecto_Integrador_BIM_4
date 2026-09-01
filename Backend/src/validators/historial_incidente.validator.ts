import { CrearHistorialIncidenteDTO } from "../models/historial_incidente.model";

// Estados válidos para historial
const ESTADOS_INCIDENTE = ["PENDIENTE", "EN_PROCESO", "RESUELTO", "CANCELADO"];

// Valida los datos para crear un registro en el historial
export function validarCrearHistorialIncidente(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar incidente id
    if (datos.incidente_id === undefined || datos.incidente_id === null) {
        errores.push("El ID del incidente es obligatorio");
    } else if (typeof datos.incidente_id !== "number") {
        errores.push("El ID del incidente debe ser un número");
    }

    // Validar estado nuevo
    if (!datos.estado_nuevo || typeof datos.estado_nuevo !== "string") {
        errores.push("El nuevo estado es obligatorio");
    } else if (!ESTADOS_INCIDENTE.includes(datos.estado_nuevo)) {
        errores.push(`El nuevo estado debe ser uno de: ${ESTADOS_INCIDENTE.join(", ")}`);
    }

    // Validar estado anterior
    if (datos.estado_anterior !== undefined && datos.estado_anterior !== null) {
        if (typeof datos.estado_anterior !== "string") {
            errores.push("El estado anterior debe ser texto");
        } else if (!ESTADOS_INCIDENTE.includes(datos.estado_anterior)) {
            errores.push(`El estado anterior debe ser uno de: ${ESTADOS_INCIDENTE.join(", ")}`);
        }
    }

    // Validar comentario
    if (!datos.comentario || typeof datos.comentario !== "string") {
        errores.push("El comentario es obligatorio y debe ser texto");
    } else if (datos.comentario.trim().length === 0) {
        errores.push("El comentario no puede estar vacío");
    } else if (datos.comentario.length > 500) {
        errores.push("El comentario no puede exceder 500 caracteres");
    }

    // Validar usuario id
    if (datos.usuario_id === undefined || datos.usuario_id === null) {
        errores.push("El ID del usuario es obligatorio");
    } else if (typeof datos.usuario_id !== "number") {
        errores.push("El ID del usuario debe ser un número");
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}