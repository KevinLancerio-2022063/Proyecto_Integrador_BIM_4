import { Pipe, PipeTransform } from "@angular/core";

// Define el pipe como standalone para importación directa
@Pipe({
  name: "tipoIncidente",
  standalone: true
})
export class TipoIncidentePipe implements PipeTransform {
  // Transforma el tipo de incidente en texto formateado con su icono
  transform(tipo: string): { texto: string; icono: string } {
    const tipos: Record<string, { texto: string; icono: string }> = {
      INUNDACION: { texto: "Inundación", icono: "flood" },
      TERREMOTO: { texto: "Terremoto", icono: "landslide" },
      INCENDIO: { texto: "Incendio", icono: "local_fire_department" },
      DESLIZAMIENTO: { texto: "Deslizamiento", icono: "landscape" },
      ACTIVIDAD_VOLCANICA: { texto: "Actividad volcánica", icono: "volcano" },
      OTRO: { texto: "Otro", icono: "warning" }
    };
    return tipos[tipo] || { texto: tipo, icono: "report_problem" };
  }
}