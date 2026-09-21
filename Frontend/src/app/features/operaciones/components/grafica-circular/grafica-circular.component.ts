import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

export interface DatosGraficaCircular {
  etiqueta: string;
  valor: number;
  color: string;
  porcentaje: number;
}

@Component({
  selector: "app-grafica-circular",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./grafica-circular.component.html",
  styleUrls: ["./grafica-circular.component.css"]
})
export class GraficaCircularComponent {

  @Input() datos: DatosGraficaCircular[] = [];

  @Input() titulo: string = "";

  @Input() tamano: number = 200;

  @Input() mostrarLeyenda: boolean = true;

  calcularTotal(): number {
    return this.datos.reduce(
      (total, dato) => total + dato.valor,
      0
    );
  }

  calcularStrokeDasharray(porcentaje: number): string {

    const circunferencia = 2 * Math.PI * 90;

    const longitud =
      (porcentaje / 100) * circunferencia;

    return `${longitud.toFixed(2)} ${(circunferencia - longitud).toFixed(2)}`;
  }

  calcularRotacion(
    index: number,
    datos: DatosGraficaCircular[]
  ): string {

    let rotacionAcumulada = 0;

    for (let i = 0; i < index; i++) {

      rotacionAcumulada +=
        (datos[i].porcentaje / 100) * 360;
    }

    return `rotate(${rotacionAcumulada.toFixed(2)} 100 100)`;
  }
}