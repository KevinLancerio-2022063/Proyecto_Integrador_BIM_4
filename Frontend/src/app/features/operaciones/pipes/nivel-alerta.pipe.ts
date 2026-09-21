import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nivelAlerta',
  standalone: true
})
export class NivelAlertaPipe implements PipeTransform {

  transform(nivel: string): string {
    const niveles: { [key: string]: string } = {
      INFO: 'Información',
      ADVERTENCIA: 'Advertencia',
      CRITICA: 'Crítica'
    };

    return niveles[nivel] || nivel;
  }
}