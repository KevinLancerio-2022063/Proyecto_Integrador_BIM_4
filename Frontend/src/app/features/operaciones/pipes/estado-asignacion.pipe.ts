import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoAsignacion',
  standalone: true
})
export class EstadoAsignacionPipe implements PipeTransform {

  transform(estado: string): string {
    const estados: { [key: string]: string } = {
      ASIGNADO: 'Asignado',
      EN_CAMINO: 'En camino',
      ACTIVO: 'Activo',
      FINALIZADO: 'Finalizado'
    };

    return estados[estado] || estado;
  }
}