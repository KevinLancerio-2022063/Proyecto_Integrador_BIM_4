import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const authResponse = await this.service.login({ email, password });
            res.json(authResponse);
        } catch (error) {
            if (error instanceof Error && error.message === 'Credenciales inválidas') {
                res.status(401).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error en el login', error });
            }
        }
    }

    async verifyToken(req: Request, res: Response): Promise<void> {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                res.status(401).json({ message: 'Token no proporcionado' });
                return;
            }
            const decoded = this.service.verifyToken(token);
            res.json({ valid: true, user: decoded });
        } catch (error) {
            res.status(401).json({ message: 'Token inválido o expirado' });
        }
    }
}