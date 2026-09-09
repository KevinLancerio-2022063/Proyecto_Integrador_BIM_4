import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "estadoAsignacion",
  standalone: true
})
export class EstadoAsignacionPipe implements PipeTransform {
  // Transforma el estado de asignación en texto formateado con clase CSS
  transform(estado: string): { texto: string; clase: string } {
    const estados: Record<string, { texto: string; clase: string }> = {
      SOLICITADO: { texto: "Solicitado", clase: "bg-blue-100 text-blue-700" },
      ASIGNADO: { texto: "Asignado", clase: "bg-purple-100 text-purple-700" },
      ENVIADO: { texto: "Enviado", clase: "bg-amber-100 text-amber-700" },
      ENTREGADO: { texto: "Entregado", clase: "bg-emerald-100 text-emerald-700" },
      CANCELADO: { texto: "Cancelado", clase: "bg-red-100 text-red-700" }
    };
    return estados[estado] || { texto: estado, clase: "bg-gray-100 text-gray-700" };
  }
}