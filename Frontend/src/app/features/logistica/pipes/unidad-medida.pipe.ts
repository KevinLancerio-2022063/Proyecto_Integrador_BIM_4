import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "unidadMedida",
  standalone: true
})
export class UnidadMedidaPipe implements PipeTransform {
  // Transforma la unidad de medida en texto legible
  transform(unidad: string): string {
    const unidades: Record<string, string> = {
      UNIDAD: "unidad(es)",
      CAJA: "caja(s)",
      KILOGRAMO: "kg",
      LITRO: "litro(s)",
      PERSONA: "persona(s)",
      OTRO: unidad.toLowerCase()
    };
    return unidades[unidad] || unidad.toLowerCase();
  }
}