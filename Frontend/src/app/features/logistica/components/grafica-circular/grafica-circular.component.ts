// Importa las dependencias necesarias de Angular
import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

// Define la interfaz para los datos de la gráfica
export interface DatosGraficaCircular {
  etiqueta: string;
  valor: number;
  color: string;
  porcentaje: number;
}

// Define el componente como independiente (standalone)
@Component({
  selector: "app-grafica-circular",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./grafica-circular.component.html",
  styleUrls: ["./grafica-circular.component.css"]
})
export class GraficaCircularComponent {
  // Datos de entrada para la gráfica
  @Input() datos: DatosGraficaCircular[] = [];
  
  // Título opcional de la gráfica
  @Input() titulo: string = "";
  
  // Tamaño del gráfico en píxeles
  @Input() tamano: number = 200;
  
  // Muestra u oculta la leyenda
  @Input() mostrarLeyenda: boolean = true;

  // Calcula el stroke-dasharray para cada segmento
  calcularStrokeDasharray(porcentaje: number): string {
    const circunferencia = 2 * Math.PI * 90; // Radio de 90
    const longitud = (porcentaje / 100) * circunferencia;
    // Redondea a 2 decimales para evitar errores en SVG
    return `${longitud.toFixed(2)} ${(circunferencia - longitud).toFixed(2)}`;
  }

  // Calcula la rotación para cada segmento
  calcularRotacion(index: number, datos: DatosGraficaCircular[]): string {
    let rotacionAcumulada = 0;
    for (let i = 0; i < index; i++) {
      rotacionAcumulada += (datos[i].porcentaje / 100) * 360;
    }
    // Redondea a 2 decimales y asegura formato válido para SVG
    return `rotate(${rotacionAcumulada.toFixed(2)})`;
  }
}