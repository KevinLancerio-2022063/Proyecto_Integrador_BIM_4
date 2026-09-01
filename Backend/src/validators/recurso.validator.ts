import { CrearRecursoDTO, ActualizarRecursoDTO } from "../models/recurso.model";

// Tipos válidos para recurso
const TIPOS_RECURSO = ["AGUA", "ALIMENTO", "MEDICAMENTO", "EQUIPO", "VEHICULO", "OTRO"];

// Unidades de medida válidas
const UNIDADES_MEDIDA = ["UNIDAD", "CAJA", "KILOGRAMO", "LITRO", "PERSONA", "OTRO"];

// Valida los datos para crear un recurso
export function validarCrearRecurso(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar nombre
    if (!datos.nombre || typeof datos.nombre !== "string") {
        errores.push("El nombre es obligatorio y debe ser texto");
    } else if (datos.nombre.trim().length === 0) {
        errores.push("El nombre no puede estar vacío");
    } else if (datos.nombre.length > 120) {
        errores.push("El nombre no puede exceder 120 caracteres");
    }

    // Validar tipo
    if (!datos.tipo || typeof datos.tipo !== "string") {
        errores.push("El tipo es obligatorio");
    } else if (!TIPOS_RECURSO.includes(datos.tipo)) {
        errores.push(`El tipo debe ser uno de: ${TIPOS_RECURSO.join(", ")}`);
    }

    // Validar unidad_medida
    if (datos.unidad_medida !== undefined && datos.unidad_medida !== null) {
        if (typeof datos.unidad_medida !== "string") {
            errores.push("La unidad de medida debe ser texto");
        } else if (!UNIDADES_MEDIDA.includes(datos.unidad_medida)) {
            errores.push(`La unidad de medida debe ser una de: ${UNIDADES_MEDIDA.join(", ")}`);
        }
    }

    // Validar cantidad_total
    if (datos.cantidad_total !== undefined && datos.cantidad_total !== null) {
        if (typeof datos.cantidad_total !== "number") {
            errores.push("La cantidad total debe ser un número");
        } else if (datos.cantidad_total < 0) {
            errores.push("La cantidad total no puede ser negativa");
        }
    }

    // Validar descripcion
    if (datos.descripcion !== undefined && datos.descripcion !== null) {
        if (typeof datos.descripcion !== "string") {
            errores.push("La descripción debe ser texto");
        } else if (datos.descripcion.length > 1000) {
            errores.push("La descripción no puede exceder 1000 caracteres");
        }
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}

// Valida los datos para actualizar un recurso
export function validarActualizarRecurso(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar nombre
    if (!datos.nombre || typeof datos.nombre !== "string") {
        errores.push("El nombre es obligatorio");
    } else if (datos.nombre.trim().length === 0) {
        errores.push("El nombre no puede estar vacío");
    } else if (datos.nombre.length > 120) {
        errores.push("El nombre no puede exceder 120 caracteres");
    }

    // Validar tipo
    if (!datos.tipo || typeof datos.tipo !== "string") {
        errores.push("El tipo es obligatorio");
    } else if (!TIPOS_RECURSO.includes(datos.tipo)) {
        errores.push(`El tipo debe ser uno de: ${TIPOS_RECURSO.join(", ")}`);
    }

    // Validar unidad_medida
    if (!datos.unidad_medida || typeof datos.unidad_medida !== "string") {
        errores.push("La unidad de medida es obligatoria");
    } else if (!UNIDADES_MEDIDA.includes(datos.unidad_medida)) {
        errores.push(`La unidad de medida debe ser una de: ${UNIDADES_MEDIDA.join(", ")}`);
    }

    // Validar cantidad_total
    if (datos.cantidad_total === undefined || datos.cantidad_total === null) {
        errores.push("La cantidad total es obligatoria");
    } else if (typeof datos.cantidad_total !== "number") {
        errores.push("La cantidad total debe ser un número");
    } else if (datos.cantidad_total < 0) {
        errores.push("La cantidad total no puede ser negativa");
    }

    // Validar descripcion
    if (datos.descripcion !== undefined && datos.descripcion !== null) {
        if (typeof datos.descripcion !== "string") {
            errores.push("La descripción debe ser texto");
        } else if (datos.descripcion.length > 1000) {
            errores.push("La descripción no puede exceder 1000 caracteres");
        }
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}