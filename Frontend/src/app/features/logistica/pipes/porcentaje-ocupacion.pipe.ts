import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "porcentajeOcupacion",
  standalone: true
})
export class PorcentajeOcupacionPipe implements PipeTransform {
  // Calcula el porcentaje de ocupación del refugio
  transform(ocupacionActual: number, capacidadTotal: number): number {
    if (!capacidadTotal || capacidadTotal === 0) return 0;
    const porcentaje = (ocupacionActual / capacidadTotal) * 100;
    return Math.min(Math.round(porcentaje), 100);
  }
}