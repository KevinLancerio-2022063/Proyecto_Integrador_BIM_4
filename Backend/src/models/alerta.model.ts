import { Tipo } from './tipo.model';
import { Nivel } from './nivel.model';
import { Estado } from './estado.model';

export interface Alerta {
    id: number;
    incidente_id?: number;
    zona_id?: number;
    refugio_id?: number;
    tipo: Tipo;
    nivel: Nivel;
    mensaje: string;
    estado: Estado;
    fecha: Date;
};