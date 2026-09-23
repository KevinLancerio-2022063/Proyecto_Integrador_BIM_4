// src/app/features/core/pipes/fecha.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fecha', standalone: true })
export class FechaPipe implements PipeTransform {
    transform(value: string | Date | null | undefined, formato: 'corta' | 'larga' = 'corta'): string {
        if (!value) return '—';
        const date = typeof value === 'string' ? new Date(value) : value;
        if (isNaN(date.getTime())) return '—';

        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');

        return formato === 'corta' ? `${dd}/${mm}/${yyyy}` : `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    }
}