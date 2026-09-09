import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "estadoRefugio",
  standalone: true
})
export class EstadoRefugioPipe implements PipeTransform {
  // Transforma el estado del refugio en texto formateado con clase CSS
  transform(estado: string): { texto: string; clase: string } {
    const estados: Record<string, { texto: string; clase: string }> = {
      DISPONIBLE: { texto: "Disponible", clase: "bg-emerald-100 text-emerald-700" },
      PARCIAL: { texto: "Parcial", clase: "bg-amber-100 text-amber-700" },
      LLENO: { texto: "Lleno", clase: "bg-red-100 text-red-700" },
      INACTIVO: { texto: "Inactivo", clase: "bg-gray-100 text-gray-700" }
    };
    return estados[estado] || { texto: estado, clase: "bg-gray-100 text-gray-700" };
  }
}