import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "fechaFormateada",
  standalone: true
})
export class FechaFormateadaPipe implements PipeTransform {
  // Transforma fechas ISO a formato legible en español
  transform(fecha: string): string {
    if (!fecha) return "Sin fecha";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-GT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }
}