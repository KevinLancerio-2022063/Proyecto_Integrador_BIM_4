import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolAsignacion',
  standalone: true
})
export class RolAsignacionPipe implements PipeTransform {

  transform(rol: string): string {
    const roles: { [key: string]: string } = {
      COORDINACION: 'Coordinación',
      RESCATE: 'Rescate',
      APOYO: 'Apoyo',
      LOGISTICA: 'Logística',
      GESTION_REFUGIO: 'Gestión de Refugio'
    };

    return roles[rol] || rol;
  }
}