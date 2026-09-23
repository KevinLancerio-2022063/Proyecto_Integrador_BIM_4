export interface Usuario {
    id?: number;
    nombre: string;
    email: string;
    password_hash?: string;
    telefono?: string;
    rol: 'ADMIN' | 'COORDINADOR' | 'RESCATISTA' | 'VOLUNTARIO' | 'GESTOR_REFUGIO';
    activo?: boolean;
    habilidades?: string;
    disponible?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface UsuarioLogin {
    email: string;
    password: string;
}

export interface UsuarioResponse {
    id: number;
    nombre: string;
    email: string;
    telefono?: string;
    rol: string;
    activo: boolean;
    habilidades?: string;
    disponible: boolean;
    created_at: Date;
    updated_at?: Date;
}

export interface AuthResponse {
    usuario: UsuarioResponse;
    token: string;
}