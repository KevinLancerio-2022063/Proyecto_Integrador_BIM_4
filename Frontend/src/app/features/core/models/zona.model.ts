export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';

export interface Zona {
    id?: number;
    nombre: string;
    municipio?: string;
    departamento?: string;
    pais?: string;
    latitud?: number;
    longitud?: number;
    nivel_riesgo: NivelRiesgo;
    activo?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ZonaResponse {
    id: number;
    nombre: string;
    municipio?: string;
    departamento?: string;
    pais: string;
    // OJO: el backend devuelve numeric como string en pg, no number
    latitud?: number | string | null;
    longitud?: number | string | null;
    nivel_riesgo: NivelRiesgo;
    activo: boolean;
    created_at: string;
    updated_at?: string;
}