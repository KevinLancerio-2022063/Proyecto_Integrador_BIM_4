import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoDestinoAsignacion',
  standalone: true
})
export class TipoDestinoAsignacionPipe implements PipeTransform {

  transform(asignacion: any): string {
    if (asignacion?.incidente_id) {
      return 'Incidente';
    }

    if (asignacion?.refugio_id) {
      return 'Refugio';
    }

    return 'Sin destino';
  }
}