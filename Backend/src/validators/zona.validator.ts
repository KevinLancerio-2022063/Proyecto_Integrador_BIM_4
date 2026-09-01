import { Request, Response, NextFunction } from 'express';
import { Zona } from '../models/zona.model';

export function validateZona(req: Request, res: Response, next: NextFunction): void {
    const zona: Zona = req.body;
    const errors: string[] = [];

    if (!zona.nombre || zona.nombre.trim().length === 0) {
        errors.push('El nombre es requerido');
    }

    const nivelesValidos = ['BAJO', 'MEDIO', 'ALTO', 'CRITICO'];
    if (zona.nivel_riesgo && !nivelesValidos.includes(zona.nivel_riesgo)) {
        errors.push('Nivel de riesgo inválido');
    }

    if (zona.latitud && (zona.latitud < -90 || zona.latitud > 90)) {
        errors.push('Latitud inválida');
    }

    if (zona.longitud && (zona.longitud < -180 || zona.longitud > 180)) {
        errors.push('Longitud inválida');
    }

    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }

    next();
}