import { Request, Response, NextFunction } from 'express';
import { Usuario } from '../models/usuario.model';

export function validateUsuario(req: Request, res: Response, next: NextFunction): void {
    const usuario: Usuario = req.body;
    const errors: string[] = [];

    if (!usuario.nombre || usuario.nombre.trim().length === 0) {
        errors.push('El nombre es requerido');
    }

    if (!usuario.email || !isValidEmail(usuario.email)) {
        errors.push('Email inválido');
    }

    if (req.method === 'POST' && (!usuario.password_hash || usuario.password_hash.length < 6)) {
        errors.push('La contraseña debe tener al menos 6 caracteres');
    }

    const rolesValidos = ['ADMIN', 'COORDINADOR', 'RESCATISTA', 'VOLUNTARIO', 'GESTOR_REFUGIO'];
    if (usuario.rol && !rolesValidos.includes(usuario.rol)) {
        errors.push('Rol inválido');
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