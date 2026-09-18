// src/app/features/core/pipes/disponible.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'disponible', standalone: true })
export class DisponiblePipe implements PipeTransform {
    transform(value: boolean | null | undefined): string {
        if (value === null || value === undefined) return '—';
        return value ? 'Disponible' : 'No disponible';
    }
}