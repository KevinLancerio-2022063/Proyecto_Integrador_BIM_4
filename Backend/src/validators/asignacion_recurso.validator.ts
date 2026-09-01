import { CrearAsignacionRecursoDTO, ActualizarAsignacionRecursoDTO } from "../models/asignacion_recurso.model";

// Estados válidos para asignación de recurso
const ESTADOS_ASIGNACION = ["SOLICITADO", "ASIGNADO", "ENVIADO", "ENTREGADO", "CANCELADO"];

// Valida los datos para crear una asignación de recurso
export function validarCrearAsignacionRecurso(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar recurso_id
    if (!datos.recurso_id || typeof datos.recurso_id !== "number") {
        errores.push("El recurso_id es obligatorio y debe ser un número");
    } else if (datos.recurso_id <= 0) {
        errores.push("El recurso_id debe ser mayor a cero");
    }

    // Validar cantidad
    if (datos.cantidad === undefined || datos.cantidad === null) {
        errores.push("La cantidad es obligatoria");
    } else if (typeof datos.cantidad !== "number") {
        errores.push("La cantidad debe ser un número");
    } else if (datos.cantidad <= 0) {
        errores.push("La cantidad debe ser mayor a cero");
    }

    // Validar estado
    if (datos.estado !== undefined && datos.estado !== null) {
        if (typeof datos.estado !== "string") {
            errores.push("El estado debe ser texto");
        } else if (!ESTADOS_ASIGNACION.includes(datos.estado)) {
            errores.push(`El estado debe ser uno de: ${ESTADOS_ASIGNACION.join(", ")}`);
        }
    }

    // Validar que tenga un destino único (incidente_id o refugio_id, no ambos)
    const tieneIncidente = datos.incidente_id !== undefined && datos.incidente_id !== null;
    const tieneRefugio = datos.refugio_id !== undefined && datos.refugio_id !== null;

    if (tieneIncidente && tieneRefugio) {
        errores.push("La asignación debe tener un solo destino: incidente_id o refugio_id, no ambos");
    }

    if (!tieneIncidente && !tieneRefugio) {
        errores.push("La asignación debe tener al menos un destino: incidente_id o refugio_id");
    }

    // Validar incidente_id
    if (tieneIncidente) {
        if (typeof datos.incidente_id !== "number") {
            errores.push("El incidente_id debe ser un número");
        } else if (datos.incidente_id <= 0) {
            errores.push("El incidente_id debe ser mayor a cero");
        }
    }

    // Validar refugio_id
    if (tieneRefugio) {
        if (typeof datos.refugio_id !== "number") {
            errores.push("El refugio_id debe ser un número");
        } else if (datos.refugio_id <= 0) {
            errores.push("El refugio_id debe ser mayor a cero");
        }
    }

    // Validar usuario_asigna_id
    if (datos.usuario_asigna_id !== undefined && datos.usuario_asigna_id !== null) {
        if (typeof datos.usuario_asigna_id !== "number") {
            errores.push("El usuario_asigna_id debe ser un número");
        } else if (datos.usuario_asigna_id <= 0) {
            errores.push("El usuario_asigna_id debe ser mayor a cero");
        }
    }

    // Validar observaciones
    if (datos.observaciones !== undefined && datos.observaciones !== null) {
        if (typeof datos.observaciones !== "string") {
            errores.push("Las observaciones deben ser texto");
        }
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}

// Valida los datos para actualizar una asignación de recurso
export function validarActualizarAsignacionRecurso(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar cantidad
    if (datos.cantidad === undefined || datos.cantidad === null) {
        errores.push("La cantidad es obligatoria");
    } else if (typeof datos.cantidad !== "number") {
        errores.push("La cantidad debe ser un número");
    } else if (datos.cantidad <= 0) {
        errores.push("La cantidad debe ser mayor a cero");
    }

    // Validar estado
    if (!datos.estado || typeof datos.estado !== "string") {
        errores.push("El estado es obligatorio");
    } else if (!ESTADOS_ASIGNACION.includes(datos.estado)) {
        errores.push(`El estado debe ser uno de: ${ESTADOS_ASIGNACION.join(", ")}`);
    }

    // Validar fecha_asignacion
    if (datos.fecha_asignacion !== undefined && datos.fecha_asignacion !== null) {
        if (typeof datos.fecha_asignacion !== "string") {
            errores.push("La fecha_asignacion debe ser texto (ISO 8601)");
        }
    }

    // Validar fecha_entrega
    if (datos.fecha_entrega !== undefined && datos.fecha_entrega !== null) {
        if (typeof datos.fecha_entrega !== "string") {
            errores.push("La fecha_entrega debe ser texto (ISO 8601)");
        }
    }

    // Validar observaciones
    if (datos.observaciones !== undefined && datos.observaciones !== null) {
        if (typeof datos.observaciones !== "string") {
            errores.push("Las observaciones deben ser texto");
        }
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}