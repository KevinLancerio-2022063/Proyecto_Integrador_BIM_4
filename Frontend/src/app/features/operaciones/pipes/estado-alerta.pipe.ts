import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoAlerta',
  standalone: true
})
export class EstadoAlertaPipe implements PipeTransform {

  transform(estado: string): string {
    const estados: { [key: string]: string } = {
      ACTIVA: 'Activa',
      LEIDA: 'Leída',
      RESUELTA: 'Resuelta'
    };

    return estados[estado] || estado;
  }
}