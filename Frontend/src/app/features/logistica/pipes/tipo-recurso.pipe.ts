import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "tipoRecurso",
  standalone: true
})
export class TipoRecursoPipe implements PipeTransform {
  // Transforma el tipo de recurso en texto legible con icono Material
  transform(tipo: string): { texto: string; icono: string } {
    const tipos: Record<string, { texto: string; icono: string }> = {
      AGUA: { texto: "Agua", icono: "water_drop" },
      ALIMENTO: { texto: "Alimento", icono: "restaurant" },
      MEDICAMENTO: { texto: "Medicamento", icono: "medical_services" },
      EQUIPO: { texto: "Equipo", icono: "construction" },
      VEHICULO: { texto: "Vehículo", icono: "local_shipping" },
      OTRO: { texto: "Otro", icono: "category" }
    };
    return tipos[tipo] || { texto: tipo, icono: "inventory_2" };
  }
}