import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoAlerta',
  standalone: true
})
export class TipoAlertaPipe implements PipeTransform {

  transform(tipo: string): string {
    const tipos: { [key: string]: string } = {
      EMERGENCIA: 'Emergencia',
      RECURSO: 'Recurso',
      REFUGIO: 'Refugio',
      SEGUIMIENTO: 'Seguimiento',
      OTRO: 'Otro'
    };

    return tipos[tipo] || tipo;
  }
}