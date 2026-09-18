// src/app/features/core/pipes/coordenadas.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'coordenadas', standalone: true })
export class CoordenadasPipe implements PipeTransform {
    /**
     * Uso:
     *   {{ zona.latitud | coordenadas: 'lat' }}
     *   {{ zona.latitud | coordenadas: 'lat': 4 }}
     * Formato: 14.6349° N  /  -90.5069° W
     */
    transform(
        valor: number | string | null | undefined,
        tipo: 'lat' | 'long' = 'lat',
        decimales = 4
    ): string {
        if (valor === null || valor === undefined || valor === '') return '—';
        const num = typeof valor === 'string' ? parseFloat(valor) : valor;
        if (isNaN(num)) return '—';

        const dir =
            tipo === 'lat'
                ? num >= 0 ? 'N' : 'S'
                : num >= 0 ? 'E' : 'W';

        return `${Math.abs(num).toFixed(decimales)}° ${dir}`;
    }
}