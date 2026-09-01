import { AuthRepository } from '../repositories/auth.repository';
import { LoginCredentials, AuthResponse } from '../models/auth.model';
import { UsuarioResponse } from '../models/usuario.model';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class AuthService {
    private repository: AuthRepository;
    private jwtSecret: string;
    private jwtExpiresIn: string;

    constructor() {
        this.repository = new AuthRepository();
        this.jwtSecret = process.env.JWT_SECRET || 'clave_secreta_por_defecto';
        this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const usuario = await this.repository.findByEmail(credentials.email);
        
        if (!usuario) {
            throw new Error('Credenciales inválidas');
        }

        const isValidPassword = await bcrypt.compare(
            credentials.password,
            usuario.password_hash || ''
        );

        if (!isValidPassword) {
            throw new Error('Credenciales inválidas');
        }

        const usuarioResponse: UsuarioResponse = {
            id: usuario.id!,
            nombre: usuario.nombre,
            email: usuario.email,
            telefono: usuario.telefono,
            rol: usuario.rol,
            activo: usuario.activo!,
            habilidades: usuario.habilidades,
            disponible: usuario.disponible!,
            created_at: usuario.created_at!,
            updated_at: usuario.updated_at
        };

        const token = jwt.sign(
            {
                userId: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            },
            this.jwtSecret,
            { expiresIn: this.jwtExpiresIn as any } // <- Solución aplicada aquí
        );

        return {
            usuario: usuarioResponse,
            token
        };
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
}
