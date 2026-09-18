import { Pipe, PipeTransform } from '@angular/core';
import { NivelRiesgo } from '../models/zona.model';

const LABELS: Record<NivelRiesgo, string> = {
    BAJO: 'Bajo',
    MEDIO: 'Medio',
    ALTO: 'Alto',
    CRITICO: 'Crítico'
};

@Pipe({ name: 'nivelRiesgo', standalone: true })
export class NivelRiesgoPipe implements PipeTransform {
    transform(valor: NivelRiesgo | string | null | undefined): string {
        if (!valor) return '—';
        return LABELS[valor as NivelRiesgo] ?? valor;
    }
}