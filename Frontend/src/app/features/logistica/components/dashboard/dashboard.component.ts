import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import {
  EstadisticasService,
  DatosGrafica
} from "./../../services/estadisticas.service";

import {
  GraficaCircularComponent
} from "./../../components/grafica-circular/grafica-circular.component";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GraficaCircularComponent
  ],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {

  estadisticas: any = null;

  loading: boolean = true;

  // ============================================
  // Gráficas existentes
  // ============================================

  recursosPorTipo: DatosGrafica[] = [];

  asignacionesPorEstado: DatosGrafica[] = [];

  ocupacionPromedio: number = 0;


  // ============================================
  // Gráfica de refugios por estado
  // ============================================

  refugiosPorEstado: DatosGrafica[] = [];


  // ============================================
  // Nuevas gráficas
  // ============================================

  alertasPorNivel: DatosGrafica[] = [];

  asignacionesPersonalPorRol: DatosGrafica[] = [];


  constructor(
    private estadisticasService: EstadisticasService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.cargarEstadisticas();

  }


  cargarEstadisticas(): void {

    this.loading = true;

    console.log("Iniciando carga de estadísticas...");

    this.estadisticasService.getEstadisticasCompletas().subscribe({

      next: (data) => {

        console.log("Estadísticas recibidas:", data);

        // ============================================
        // Datos existentes
        // ============================================

        this.estadisticas = data;

        this.recursosPorTipo = data.recursosPorTipo;

        this.asignacionesPorEstado = data.asignacionesPorEstado;

        this.ocupacionPromedio =
          data.ocupacionPromedioRefugios;


        // ============================================
        // Refugios por estado
        // ============================================

        this.refugiosPorEstado = data.refugiosPorEstado;

        // ============================================


        // ============================================
        // Nuevos datos
        // ============================================

        this.alertasPorNivel =
          data.alertasPorNivel;

        this.asignacionesPersonalPorRol =
          data.asignacionesPersonalPorRol;


        // ============================================
        // Finalizar carga
        // ============================================

        this.loading = false;

        this.cdr.detectChanges();

        console.log("Loading puesto en false");

      },


      error: (error) => {

        console.error(
          "Error al cargar estadísticas:",
          error
        );

        this.loading = false;

        this.cdr.detectChanges();

      }

    });

  }

}