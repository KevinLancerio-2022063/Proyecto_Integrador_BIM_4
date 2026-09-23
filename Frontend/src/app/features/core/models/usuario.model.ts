// src/app/features/core/models/usuario.model.ts
export type Rol = 'ADMIN' | 'COORDINADOR' | 'RESCATISTA' | 'VOLUNTARIO' | 'GESTOR_REFUGIO';

export type RolPublico = 'VOLUNTARIO' | 'RESCATISTA' | 'GESTOR_REFUGIO';

export interface Usuario {
    id?: number;
    nombre: string;
    email: string;
    password_hash?: string;
    telefono?: string;
    rol: Rol;
    activo?: boolean;
    habilidades?: string;
    disponible?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface UsuarioResponse {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    rol: Rol;
    activo: boolean;
    habilidades?: string;
    disponible: boolean;
    created_at: string;
    updated_at?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    nombre: string;
    email: string;
    password: string;
    telefono?: string;
    rol: RolPublico;
    habilidades?: string;
    disponible?: boolean;
}

export interface AuthResponse {
    usuario: UsuarioResponse;
    token: string;
}

export interface JwtPayload {
    userId: number;
    email: string;
    rol: Rol;
    iat: number;
    exp: number;
}