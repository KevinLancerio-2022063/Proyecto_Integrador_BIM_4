import { CrearRefugioDTO, ActualizarRefugioDTO } from "../models/refugio.model";

// Estados válidos para refugio
const ESTADOS_REFUGIO = ["DISPONIBLE", "PARCIAL", "LLENO", "INACTIVO"];

// Valida los datos para crear un refugio
export function validarCrearRefugio(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar nombre
    if (!datos.nombre || typeof datos.nombre !== "string") {
        errores.push("El nombre es obligatorio y debe ser texto");
    } else if (datos.nombre.trim().length === 0) {
        errores.push("El nombre no puede estar vacío");
    } else if (datos.nombre.length > 160) {
        errores.push("El nombre no puede exceder 160 caracteres");
    }

    // Validar capacidad_total
    if (datos.capacidad_total === undefined || datos.capacidad_total === null) {
        errores.push("La capacidad total es obligatoria");
    } else if (typeof datos.capacidad_total !== "number") {
        errores.push("La capacidad total debe ser un número");
    } else if (datos.capacidad_total <= 0) {
        errores.push("La capacidad total debe ser mayor a cero");
    }

    // Validar direccion (opcional)
    if (datos.direccion !== undefined && datos.direccion !== null) {
        if (typeof datos.direccion !== "string") {
            errores.push("La dirección debe ser texto");
        }
    }

    // Validar zona_id (opcional pero debe ser número si se proporciona)
    if (datos.zona_id !== undefined && datos.zona_id !== null) {
        if (typeof datos.zona_id !== "number") {
            errores.push("El zona_id debe ser un número");
        } else if (datos.zona_id <= 0) {
            errores.push("El zona_id debe ser mayor a cero");
        }
    }

    // Validar coordenadas (opcionales pero deben ser válidas si se proporcionan)
    if (datos.latitud !== undefined && datos.latitud !== null) {
        if (typeof datos.latitud !== "number") {
            errores.push("La latitud debe ser un número");
        } else if (datos.latitud < -90 || datos.latitud > 90) {
            errores.push("La latitud debe estar entre -90 y 90");
        }
    }

    if (datos.longitud !== undefined && datos.longitud !== null) {
        if (typeof datos.longitud !== "number") {
            errores.push("La longitud debe ser un número");
        } else if (datos.longitud < -180 || datos.longitud > 180) {
            errores.push("La longitud debe estar entre -180 y 180");
        }
    }

    // Validar responsable_id (opcional)
    if (datos.responsable_id !== undefined && datos.responsable_id !== null) {
        if (typeof datos.responsable_id !== "number") {
            errores.push("El responsable_id debe ser un número");
        } else if (datos.responsable_id <= 0) {
            errores.push("El responsable_id debe ser mayor a cero");
        }
    }

    // Validar telefono_contacto (opcional)
    if (datos.telefono_contacto !== undefined && datos.telefono_contacto !== null) {
        if (typeof datos.telefono_contacto !== "string") {
            errores.push("El teléfono de contacto debe ser texto");
        } else if (datos.telefono_contacto.length > 30) {
            errores.push("El teléfono de contacto no puede exceder 30 caracteres");
        }
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}

// Valida los datos para actualizar un refugio
export function validarActualizarRefugio(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar nombre
    if (!datos.nombre || typeof datos.nombre !== "string") {
        errores.push("El nombre es obligatorio");
    } else if (datos.nombre.trim().length === 0) {
        errores.push("El nombre no puede estar vacío");
    } else if (datos.nombre.length > 160) {
        errores.push("El nombre no puede exceder 160 caracteres");
    }

    // Validar direccion
    if (datos.direccion === undefined || datos.direccion === null) {
        errores.push("La dirección es obligatoria");
    } else if (typeof datos.direccion !== "string") {
        errores.push("La dirección debe ser texto");
    }

    // Validar zona_id
    if (datos.zona_id === undefined || datos.zona_id === null) {
        errores.push("El zona_id es obligatorio");
    } else if (typeof datos.zona_id !== "number") {
        errores.push("El zona_id debe ser un número");
    }

    // Validar coordenadas
    if (datos.latitud === undefined || datos.latitud === null) {
        errores.push("La latitud es obligatoria");
    } else if (typeof datos.latitud !== "number") {
        errores.push("La latitud debe ser un número");
    } else if (datos.latitud < -90 || datos.latitud > 90) {
        errores.push("La latitud debe estar entre -90 y 90");
    }

    if (datos.longitud === undefined || datos.longitud === null) {
        errores.push("La longitud es obligatoria");
    } else if (typeof datos.longitud !== "number") {
        errores.push("La longitud debe ser un número");
    } else if (datos.longitud < -180 || datos.longitud > 180) {
        errores.push("La longitud debe estar entre -180 y 180");
    }

    // Validar capacidad_total
    if (datos.capacidad_total === undefined || datos.capacidad_total === null) {
        errores.push("La capacidad total es obligatoria");
    } else if (typeof datos.capacidad_total !== "number") {
        errores.push("La capacidad total debe ser un número");
    } else if (datos.capacidad_total <= 0) {
        errores.push("La capacidad total debe ser mayor a cero");
    }

    // Validar ocupacion_actual
    if (datos.ocupacion_actual === undefined || datos.ocupacion_actual === null) {
        errores.push("La ocupación actual es obligatoria");
    } else if (typeof datos.ocupacion_actual !== "number") {
        errores.push("La ocupación actual debe ser un número");
    } else if (datos.ocupacion_actual < 0) {
        errores.push("La ocupación actual no puede ser negativa");
    }

    // Validar estado
    if (!datos.estado || typeof datos.estado !== "string") {
        errores.push("El estado es obligatorio");
    } else if (!ESTADOS_REFUGIO.includes(datos.estado)) {
        errores.push(`El estado debe ser uno de: ${ESTADOS_REFUGIO.join(", ")}`);
    }

    // Validar responsable_id
    if (datos.responsable_id === undefined || datos.responsable_id === null) {
        errores.push("El responsable_id es obligatorio");
    } else if (typeof datos.responsable_id !== "number") {
        errores.push("El responsable_id debe ser un número");
    }

    // Validar telefono_contacto
    if (datos.telefono_contacto === undefined || datos.telefono_contacto === null) {
        errores.push("El teléfono de contacto es obligatorio");
    } else if (typeof datos.telefono_contacto !== "string") {
        errores.push("El teléfono de contacto debe ser texto");
    } else if (datos.telefono_contacto.length > 30) {
        errores.push("El teléfono de contacto no puede exceder 30 caracteres");
    }

    // Validar observaciones (opcional)
    if (datos.observaciones !== undefined && datos.observaciones !== null) {
        if (typeof datos.observaciones !== "string") {
            errores.push("Las observaciones deben ser texto");
        }
    }

    // Validación de negocio: ocupación no puede exceder capacidad
    if (datos.ocupacion_actual !== undefined && datos.capacidad_total !== undefined) {
        if (datos.ocupacion_actual > datos.capacidad_total) {
            errores.push("La ocupación actual no puede exceder la capacidad total");
        }
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}