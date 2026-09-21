import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "nivelEmergencia",
  standalone: true
})
export class NivelEmergenciaPipe implements PipeTransform {
  // Transforma el nivel de emergencia en texto formateado con clase CSS
  transform(nivel: string): { texto: string; clase: string } {
    const niveles: Record<string, { texto: string; clase: string }> = {
      BAJA: { texto: "Baja", clase: "bg-info text-dark" },
      MEDIA: { texto: "Media", clase: "bg-warning text-dark" },
      ALTA: { texto: "Alta", clase: "bg-danger text-white" },
      CRITICA: { texto: "Crítica", clase: "bg-dark text-white" }
    };
    return niveles[nivel] || { texto: nivel, clase: "bg-secondary text-white" };
  }
}