// src/app/features/core/interfaces/core.interface.ts
export interface ApiError {
    message?: string;
    errors?: string[];
    errorDetail?: string;
    error?: unknown;
}

export interface ApiMessage {
    message: string;
}

export interface RolOption {
    value: 'VOLUNTARIO' | 'RESCATISTA' | 'GESTOR_REFUGIO';
    label: string;
}