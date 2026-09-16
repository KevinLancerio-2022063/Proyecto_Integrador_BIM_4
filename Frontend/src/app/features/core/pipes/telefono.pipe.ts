// src/app/features/core/pipes/telefono.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'telefono', standalone: true })
export class TelefonoPipe implements PipeTransform {
    transform(value: string | null | undefined): string {
        if (!value) return '—';
        // Formato: 5555-1001 → (5555) 1001, sin alterar si no matchea
        const match = value.match(/^(\d{4})-(\d{4})$/);
        return match ? `(${match[1]}) ${match[2]}` : value;
    }
}