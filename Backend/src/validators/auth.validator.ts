import { Request, Response, NextFunction } from 'express';
import { LoginCredentials } from '../models/auth.model';

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
    const credentials: LoginCredentials = req.body;
    const errors: string[] = [];

    if (!credentials.email || !isValidEmail(credentials.email)) {
        errors.push('Email inválido');
    }

    if (!credentials.password || credentials.password.length < 6) {
        errors.push('Contraseña inválida');
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