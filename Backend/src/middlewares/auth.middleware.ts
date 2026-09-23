import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        rol: string;
    };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'clave_secreta_por_defecto';

    try {
        const decoded = jwt.verify(token, secret) as { userId: number; email: string; rol: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

// Middleware opcional para restringir por rol
export function roleMiddleware(...rolesPermitidos: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        if (!rolesPermitidos.includes(req.user.rol)) {
            res.status(403).json({ message: 'No tienes permisos para esta acción' });
            return;
        }
        next();
    };
}