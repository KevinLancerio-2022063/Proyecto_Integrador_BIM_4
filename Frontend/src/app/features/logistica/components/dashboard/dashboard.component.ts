// Importa las dependencias necesarias de Angular
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { EstadisticasService, DatosGrafica } from "./../../services/estadisticas.service";
import { GraficaCircularComponent } from "./../../components/grafica-circular/grafica-circular.component";

// Define el componente como independiente (standalone)
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
  // Datos de estadísticas
  estadisticas: any = null;
  
  // Indicador de carga
  loading: boolean = true;
  
  // Datos para las gráficas
  recursosPorTipo: DatosGrafica[] = [];
  asignacionesPorEstado: DatosGrafica[] = [];
  ocupacionPromedio: number = 0;

  // Inyecta el servicio de estadísticas y el detector de cambios
  constructor(
    private estadisticasService: EstadisticasService,
    private cdr: ChangeDetectorRef
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  // Carga las estadísticas desde el servicio
  cargarEstadisticas(): void {
    this.loading = true;
    console.log("Iniciando carga de estadísticas...");
    
    this.estadisticasService.getEstadisticasCompletas().subscribe({
      next: (data) => {
        console.log("Estadísticas recibidas:", data);
        this.estadisticas = data;
        this.recursosPorTipo = data.recursosPorTipo;
        this.asignacionesPorEstado = data.asignacionesPorEstado;
        this.ocupacionPromedio = data.ocupacionPromedioRefugios;
        this.loading = false;
        
        // Fuerza la detección de cambios en modo zoneless
        this.cdr.detectChanges();
        
        console.log("Loading puesto en false");
      },
      error: (error) => {
        console.error("Error al cargar estadísticas:", error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}