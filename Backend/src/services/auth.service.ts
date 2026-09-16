import { AuthRepository } from '../repositories/auth.repository';
import { LoginCredentials, AuthResponse } from '../models/auth.model';
import { UsuarioResponse } from '../models/usuario.model';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface RegisterData {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    rol: 'VOLUNTARIO' | 'RESCATISTA' | 'GESTOR_REFUGIO';
    habilidades?: string;
    disponible?: boolean;
}

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
        // ... tu código actual sin cambios
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
            { expiresIn: this.jwtExpiresIn as any }
        );

        return { usuario: usuarioResponse, token };
    }

    // ⬇️ NUEVO MÉTODO
    async register(data: RegisterData): Promise<AuthResponse> {
        // 1. Verificar duplicado
        const existente = await this.repository.findByEmail(data.email);
        if (existente) {
            throw new Error('El email ya está registrado');
        }

        // 2. Hashear contraseña
        const passwordHash = await bcrypt.hash(data.password, 10);

        // 3. Insertar vía repositorio (usa el SP existente)
        await this.repository.create({
            nombre: data.nombre,
            email: data.email,
            password_hash: passwordHash,
            telefono: data.telefono,
            rol: data.rol,
            habilidades: data.habilidades,
            disponible: data.disponible ?? false
        });

        // 4. Recuperar el usuario recién creado para generar el JWT
        const usuario = await this.repository.findByEmail(data.email);
        if (!usuario) {
            throw new Error('Error al crear el usuario');
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

        // 5. Generar token (auto-login tras registro)
        const token = jwt.sign(
            {
                userId: usuario.id,
                email: usuario.email,
                rol: usuario.rol
            },
            this.jwtSecret,
            { expiresIn: this.jwtExpiresIn as any }
        );

        return { usuario: usuarioResponse, token };
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.jwtSecret);
        } catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
}