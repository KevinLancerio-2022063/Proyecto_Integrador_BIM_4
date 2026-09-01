import { Tipo } from '../models/tipo.model';
import { Nivel } from '../models/nivel.model';
import { Estado } from '../models/estado.model';

// Helper para obtener valores de los Enums
const TIPOS_VALIDOS = Object.values(Tipo);
const NIVELES_VALIDOS = Object.values(Nivel);
const ESTADOS_VALIDOS = Object.values(Estado);

// Valida los datos para crear una alerta
export function validarCrearAlerta(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar destino (Al menos uno de los tres es obligatorio)
    const tieneDestino = datos.incidente_id !== undefined || datos.zona_id !== undefined || datos.refugio_id !== undefined;
    if (!tieneDestino) {
        errores.push("La alerta debe estar relacionada con un incidente, zona o refugio");
    }

    // Validar IDs si existen
    if (datos.incidente_id !== undefined && typeof datos.incidente_id !== "number") errores.push("El incidente_id debe ser un número");
    if (datos.zona_id !== undefined && typeof datos.zona_id !== "number") errores.push("El zona_id debe ser un número");
    if (datos.refugio_id !== undefined && typeof datos.refugio_id !== "number") errores.push("El refugio_id debe ser un número");

    // Validar Tipo
    if (!datos.tipo) {
        errores.push("El tipo es obligatorio");
    } else if (!TIPOS_VALIDOS.includes(datos.tipo)) {
        errores.push(`El tipo debe ser uno de: ${TIPOS_VALIDOS.join(", ")}`);
    }

    // Validar Nivel
    if (!datos.nivel) {
        errores.push("El nivel es obligatorio");
    } else if (!NIVELES_VALIDOS.includes(datos.nivel)) {
        errores.push(`El nivel debe ser uno de: ${NIVELES_VALIDOS.join(", ")}`);
    }

    // Validar Mensaje
    if (!datos.mensaje || typeof datos.mensaje !== "string" || datos.mensaje.trim().length === 0) {
        errores.push("El mensaje es obligatorio y debe ser texto");
    }

    // Validar Estado (Opcional, pero si viene, debe ser válido)
    if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado)) {
        errores.push(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}`);
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}

// Valida los datos para actualizar una alerta
export function validarActualizarAlerta(datos: any): { valido: boolean; errores: string[] } {
    const errores: string[] = [];

    // Validar tipo (si viene)
    if (datos.tipo && !TIPOS_VALIDOS.includes(datos.tipo)) {
        errores.push(`El tipo debe ser uno de: ${TIPOS_VALIDOS.join(", ")}`);
    }

    // Validar nivel (si viene)
    if (datos.nivel && !NIVELES_VALIDOS.includes(datos.nivel)) {
        errores.push(`El nivel debe ser uno de: ${NIVELES_VALIDOS.join(", ")}`);
    }

    // Validar estado (si viene)
    if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado)) {
        errores.push(`El estado debe ser uno de: ${ESTADOS_VALIDOS.join(", ")}`);
    }

    // Validar mensaje
    if (datos.mensaje !== undefined && (typeof datos.mensaje !== "string" || datos.mensaje.trim().length === 0)) {
        errores.push("El mensaje debe ser texto y no puede estar vacío");
    }

    // Validación de negocio: Asegurar que, si se actualiza, no quede sin destino
    if (datos.incidente_id === null && datos.zona_id === null && datos.refugio_id === null) {
        errores.push("La alerta debe tener al menos un destino (incidente, zona o refugio)");
    }

    return {
        valido: errores.length === 0,
        errores,
    };
}