export interface Zona {
    id?: number;
    nombre: string;
    municipio?: string;
    departamento?: string;
    pais?: string;
    latitud?: number;
    longitud?: number;
    nivel_riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
    activo?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface ZonaResponse {
    id: number;
    nombre: string;
    municipio?: string;
    departamento?: string;
    pais: string;
    latitud?: number;
    longitud?: number;
    nivel_riesgo: string;
    activo: boolean;
    created_at: Date;
    updated_at?: Date;
}