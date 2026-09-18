import { Request, Response, NextFunction } from 'express';

const ROLES_PUBLICOS = ['VOLUNTARIO', 'RESCATISTA', 'GESTOR_REFUGIO'];

export function validateRegister(req: Request, res: Response, next: NextFunction): void {
    const { nombre, email, password, telefono, rol, habilidades, disponible } = req.body;
    const errors: string[] = [];

    // Nombre
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        errors.push('El nombre es requerido');
    } else if (nombre.trim().length > 120) {
        errors.push('El nombre no puede exceder 120 caracteres');
    }

    // Email
    if (!email || !isValidEmail(email)) {
        errors.push('Email inválido');
    } else if (email.length > 160) {
        errors.push('El email no puede exceder 160 caracteres');
    }

    // Password
    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    } else if (password.length > 72) {
        // bcrypt solo procesa los primeros 72 bytes
        errors.push('La contraseña no puede exceder 72 caracteres');
    }

    // Teléfono (opcional)
    if (telefono !== undefined && telefono !== null) {
        if (typeof telefono !== 'string' || telefono.length > 30) {
            errors.push('El teléfono no puede exceder 30 caracteres');
        }
    }

    // Rol (obligatorio en este endpoint)
    if (!rol || typeof rol !== 'string') {
        errors.push('El rol es requerido');
    } else if (!ROLES_PUBLICOS.includes(rol)) {
        errors.push(`Rol inválido. Roles permitidos: ${ROLES_PUBLICOS.join(', ')}`);
    }

    // Disponible (opcional)
    if (disponible !== undefined && typeof disponible !== 'boolean') {
        errors.push('El campo "disponible" debe ser booleano');
    }

    // Habilidades (opcional)
    if (habilidades !== undefined && habilidades !== null && typeof habilidades !== 'string') {
        errors.push('El campo "habilidades" debe ser texto');
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }

    next();
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}