// src/app/features/core/pipes/rol-label.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Rol } from '../models/usuario.model';

const ROL_LABELS: Record<Rol, string> = {
    ADMIN: 'Administrador',
    COORDINADOR: 'Coordinador',
    RESCATISTA: 'Rescatista',
    VOLUNTARIO: 'Voluntario',
    GESTOR_REFUGIO: 'Gestor de Refugio'
};

@Pipe({ name: 'rolLabel', standalone: true })
export class RolLabelPipe implements PipeTransform {
    transform(rol: Rol | string | null | undefined): string {
        if (!rol) return '—';
        return ROL_LABELS[rol as Rol] ?? rol;
    }
}