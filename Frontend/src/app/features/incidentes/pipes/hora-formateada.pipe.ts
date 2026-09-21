import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "horaFormateada",
  standalone: true
})
export class HoraFormateadaPipe implements PipeTransform {
  // Transforma fechas ISO a hora legible en español
  transform(fecha: Date | string): string {
    if (!fecha) return "--:--";
    const date = new Date(fecha);
    return date.toLocaleTimeString("es-GT", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }
}