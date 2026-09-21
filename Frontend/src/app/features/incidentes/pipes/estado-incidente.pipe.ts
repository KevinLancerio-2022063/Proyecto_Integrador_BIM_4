import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "estadoIncidente",
  standalone: true
})
export class EstadoIncidentePipe implements PipeTransform {
  // Transforma el estado del incidente en texto formateado con clase CSS
  transform(estado: string): { texto: string; clase: string } {
    const estados: Record<string, { texto: string; clase: string }> = {
      REPORTADO: { texto: "Reportado", clase: "bg-warning text-dark" },
      EN_ATENCION: { texto: "En atención", clase: "bg-primary text-white" },
      MITIGADO: { texto: "Mitigado", clase: "bg-info text-dark" },
      CERRADO: { texto: "Cerrado", clase: "bg-success text-white" }
    };
    return estados[estado] || { texto: estado, clase: "bg-secondary text-white" };
  }
}