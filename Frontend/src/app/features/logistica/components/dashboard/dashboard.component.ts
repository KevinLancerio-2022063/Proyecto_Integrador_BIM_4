import { Component, OnInit, ChangeDetectorRef, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { EstadisticasService, DatosGrafica } from "./../../services/estadisticas.service";
import { GraficaCircularComponent } from "./../../components/grafica-circular/grafica-circular.component";
import { IncidenteService } from "../../../incidentes/services/incidente.service";
import { HistorialService } from "../../../incidentes/services/historial.service";
import { AuthService } from "../../../core/services/auth.service";
import { Rol } from "../../../core/models/usuario.model";

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
  private authService = inject(AuthService);

  estadisticas: any = null;
  loading: boolean = true;

  recursosPorTipo: DatosGrafica[] = [];
  asignacionesPorEstado: DatosGrafica[] = [];
  ocupacionPromedio: number = 0;
  refugiosPorEstado: DatosGrafica[] = [];
  alertasPorNivel: DatosGrafica[] = [];
  asignacionesPersonalPorRol: DatosGrafica[] = [];
  
  incidentesPorTipo: DatosGrafica[] = [];
  historialPorEstadoAnterior: DatosGrafica[] = [];
  historialPorEstadoNuevo: DatosGrafica[] = [];

  coloresPorTipoIncidente: { [key: string]: string } = {
    INUNDACION: "#0ea5e9",
    TERREMOTO: "#8338ec",
    INCENDIO: "#ef4444",
    DESLIZAMIENTO: "#10b981",
    ACTIVIDAD_VOLCANICA: "#f59e0b",
    OTRO: "#6b7280"
  };

  coloresPorEstadoHistorial: { [key: string]: string } = {
    REPORTADO: "#ef4444",
    EN_ATENCION: "#f59e0b",
    MITIGADO: "#10b981",
    CERRADO: "#6b7280"
  };

  // Mapa de permisos: define qué gráficas puede ver cada rol
  graficasPermitidasPorRol: Record<Rol, string[]> = {
    'ADMIN': [
      'recursosPorTipo', 'asignacionesPorEstado', 'alertasPorNivel', 
      'asignacionesPersonalPorRol', 'refugiosPorEstado', 'incidentesPorTipo', 
      'historialPorEstadoAnterior', 'historialPorEstadoNuevo'
    ],
    'COORDINADOR': [
      'recursosPorTipo', 'asignacionesPorEstado', 'alertasPorNivel', 
      'asignacionesPersonalPorRol', 'refugiosPorEstado', 'incidentesPorTipo',
      'historialPorEstadoNuevo'
    ],
    'RESCATISTA': [
      'alertasPorNivel', 'incidentesPorTipo', 'asignacionesPersonalPorRol',
      'recursosPorTipo', 'refugiosPorEstado'
    ],
    'VOLUNTARIO': [
      'alertasPorNivel', 'incidentesPorTipo', 'recursosPorTipo'
    ],
    'GESTOR_REFUGIO': [
      'refugiosPorEstado', 'asignacionesPorEstado', 'recursosPorTipo',
      'alertasPorNivel'
    ]
  };
 // Mapa de permisos para TARJETAS de resumen
  tarjetasPermitidasPorRol: Record<Rol, string[]> = {
    'ADMIN': ['totalRecursos', 'totalRefugios', 'totalAsignaciones', 'ocupacionPromedio'],
    'COORDINADOR': ['totalRecursos', 'totalRefugios', 'totalAsignaciones', 'ocupacionPromedio'],
    'RESCATISTA': ['totalRecursos', 'totalAsignaciones'],
    'VOLUNTARIO': ['totalRecursos'],
    'GESTOR_REFUGIO': ['totalRefugios', 'ocupacionPromedio']
  };

  // Método para verificar si puede ver una tarjeta
  puedeVerTarjeta(idTarjeta: string): boolean {
    const rolActual = this.authService.getRol();
    if (!rolActual) return false;
    return this.tarjetasPermitidasPorRol[rolActual]?.includes(idTarjeta) || false;
  }

  constructor(
    private estadisticasService: EstadisticasService,
    private incidenteService: IncidenteService,
    private historialService: HistorialService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  // Método para verificar si el rol actual tiene permiso para ver una gráfica
  puedeVerGrafica(idGrafica: string): boolean {
    const rolActual = this.authService.getRol();
    if (!rolActual) return false;
    return this.graficasPermitidasPorRol[rolActual]?.includes(idGrafica) || false;
  }

  cargarEstadisticas(): void {
    this.loading = true;
    
    this.estadisticasService.getEstadisticasCompletas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.recursosPorTipo = data.recursosPorTipo;
        this.asignacionesPorEstado = data.asignacionesPorEstado;
        this.ocupacionPromedio = data.ocupacionPromedioRefugios;
        this.refugiosPorEstado = data.refugiosPorEstado;
        this.alertasPorNivel = data.alertasPorNivel;
        this.asignacionesPersonalPorRol = data.asignacionesPersonalPorRol;
        
        this.cargarIncidentesYHistorial();
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al cargar estadísticas:", error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarIncidentesYHistorial(): void {
    this.incidenteService.getAll().subscribe({
      next: (incidentes) => {
        this.incidentesPorTipo = this.calcularIncidentesPorTipo(incidentes);
        
        this.historialService.getAll().subscribe({
          next: (historiales) => {
            this.historialPorEstadoAnterior = this.calcularEstadosHistorial(historiales, 'estado_anterior');
            this.historialPorEstadoNuevo = this.calcularEstadosHistorial(historiales, 'estado_nuevo');
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error("Error al cargar historial:", error);
          }
        });
      },
      error: (error) => {
        console.error("Error al cargar incidentes:", error);
      }
    });
  }

  calcularIncidentesPorTipo(incidentes: any[]): DatosGrafica[] {
    if (!incidentes || incidentes.length === 0) return [];

    const agrupados: { [key: string]: number } = {};
    
    incidentes.forEach(incidente => {
      if (incidente.tipo) {
        agrupados[incidente.tipo] = (agrupados[incidente.tipo] || 0) + 1;
      }
    });

    const total = incidentes.length;
    
    return Object.entries(agrupados).map(([tipo, cantidad]) => ({
      etiqueta: tipo,
      valor: cantidad,
      color: this.coloresPorTipoIncidente[tipo] || "#6b7280",
      porcentaje: (cantidad / total) * 100
    }));
  }

  calcularEstadosHistorial(lista: any[], campo: string): DatosGrafica[] {
    const agrupados: { [key: string]: number } = {};
    let totalValidos = 0;
    
    lista.forEach(h => {
      const estado = h[campo];
      if (estado) {
        agrupados[estado] = (agrupados[estado] || 0) + 1;
        totalValidos++;
      }
    });

    if (totalValidos === 0) return [];

    return Object.entries(agrupados).map(([estado, cantidad]) => ({
      etiqueta: estado,
      valor: cantidad,
      color: this.coloresPorEstadoHistorial[estado] || "#6b7280",
      porcentaje: (cantidad / totalValidos) * 100
    }));
  }  
  // Verifica si el rol actual tiene al menos una gráfica permitida
  tieneAlgunaGrafica(): boolean {
    const rolActual = this.authService.getRol();
    if (!rolActual) return false;
    return (this.graficasPermitidasPorRol[rolActual]?.length || 0) > 0;
  }
}