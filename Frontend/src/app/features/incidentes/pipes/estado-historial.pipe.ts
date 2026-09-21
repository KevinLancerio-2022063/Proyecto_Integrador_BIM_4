import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "estadoHistorial",
  standalone: true
})
export class EstadoHistorialPipe implements PipeTransform {
  // Transforma el estado del historial en texto formateado con su icono
  transform(estado: string): { texto: string; icono: string } {
    const estados: Record<string, { texto: string; icono: string }> = {
      REPORTADO: { texto: "Reportado", icono: "report_problem" },
      EN_ATENCION: { texto: "En atención", icono: "engineering" },
      MITIGADO: { texto: "Mitigado", icono: "healing" },
      CERRADO: { texto: "Cerrado", icono: "check_circle" }
    };
    return estados[estado] || { texto: estado, icono: "history" };
  }
}