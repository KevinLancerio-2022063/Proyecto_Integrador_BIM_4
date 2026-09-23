import { Usuario, AuthResponse } from './usuario.model';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface JwtPayload {
    userId: number;
    email: string;
    rol: string;
}

export { Usuario, AuthResponse };