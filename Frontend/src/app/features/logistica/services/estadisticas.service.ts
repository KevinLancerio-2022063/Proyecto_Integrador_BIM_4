import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, combineLatest, map, catchError, of } from "rxjs";
import { RecursoService } from "./recurso.service";
import { RefugioService } from "./refugio.service";
import { AsignacionRecursoService } from "./asignacion-recurso.service";

// Interfaz para los datos de la gráfica
export interface DatosGrafica {
  etiqueta: string;
  valor: number;
  color: string;
  porcentaje: number;
}

// Interfaz para estadísticas completas
export interface Estadisticas {
  totalRecursos: number;
  totalRefugios: number;
  totalAsignaciones: number;
  recursosPorTipo: DatosGrafica[];
  ocupacionPromedioRefugios: number;
  asignacionesPorEstado: DatosGrafica[];
}

// Marca la clase como inyectable en toda la aplicación
@Injectable({
  providedIn: "root"
})
export class EstadisticasService {
  // Colores para la gráfica circular
  private coloresPorTipo: { [key: string]: string } = {
    AGUA: "#1fa882",
    ALIMENTO: "#e68529",
    MEDICAMENTO: "#d94141",
    EQUIPO: "#2da160",
    VEHICULO: "#e69a2e",
    OTRO: "#6b7280"
  };

  private coloresPorEstado: { [key: string]: string } = {
    SOLICITADO: "#00f0ff",
    ASIGNADO: "#8338ec",
    ENVIADO: "#ffbe0b",
    ENTREGADO: "#06ffa5",
    CANCELADO: "#ff006e"
  };

  // Inyecta los servicios necesarios
  constructor(
    private recursoService: RecursoService,
    private refugioService: RefugioService,
    private asignacionService: AsignacionRecursoService
  ) {}

  // Obtiene todas las estadísticas combinadas con manejo de errores
  getEstadisticasCompletas(): Observable<Estadisticas> {
    return combineLatest([
      // Cada observable maneja sus propios errores y devuelve array vacío si falla
      this.recursoService.getAll().pipe(
        catchError(error => {
          console.warn("Error al cargar recursos:", error);
          return of([]);
        })
      ),
      this.refugioService.getAll().pipe(
        catchError(error => {
          console.warn("Error al cargar refugios:", error);
          return of([]);
        })
      ),
      this.asignacionService.getAll().pipe(
        catchError(error => {
          console.warn("Error al cargar asignaciones:", error);
          return of([]);
        })
      )
    ]).pipe(
      map(([recursos, refugios, asignaciones]) => {
        console.log("Datos recibidos para dashboard:", {
          recursos: recursos.length,
          refugios: refugios.length,
          asignaciones: asignaciones.length
        });

        return {
          totalRecursos: recursos.length,
          totalRefugios: refugios.length,
          totalAsignaciones: asignaciones.length,
          recursosPorTipo: this.calcularRecursosPorTipo(recursos),
          ocupacionPromedioRefugios: this.calcularOcupacionPromedio(refugios),
          asignacionesPorEstado: this.calcularAsignacionesPorEstado(asignaciones)
        };
      }),
      // Manejo de error general por si algo falla en el map
      catchError(error => {
        console.error("Error general en estadísticas:", error);
        return of({
          totalRecursos: 0,
          totalRefugios: 0,
          totalAsignaciones: 0,
          recursosPorTipo: [],
          ocupacionPromedioRefugios: 0,
          asignacionesPorEstado: []
        });
      })
    );
  }

  // Calcula recursos agrupados por tipo
  private calcularRecursosPorTipo(recursos: any[]): DatosGrafica[] {
    if (!recursos || recursos.length === 0) return [];

    const agrupados: { [key: string]: number } = {};
    
    recursos.forEach(recurso => {
      if (recurso.tipo) {
        agrupados[recurso.tipo] = (agrupados[recurso.tipo] || 0) + 1;
      }
    });

    const total = recursos.length;
    
    return Object.entries(agrupados).map(([tipo, cantidad]) => ({
      etiqueta: tipo,
      valor: cantidad as number,
      color: this.coloresPorTipo[tipo] || "#6b7280",
      porcentaje: ((cantidad as number) / total) * 100
    }));
  }

  // Calcula el porcentaje promedio de ocupación de refugios
  private calcularOcupacionPromedio(refugios: any[]): number {
    if (!refugios || refugios.length === 0) return 0;
    
    const totalPorcentaje = refugios.reduce((acc, refugio) => {
      if (refugio.capacidad_total && refugio.capacidad_total > 0) {
        const porcentaje = (refugio.ocupacion_actual / refugio.capacidad_total) * 100;
        return acc + Math.min(porcentaje, 100);
      }
      return acc;
    }, 0);
    
    return Math.round(totalPorcentaje / refugios.length);
  }

  // Calcula asignaciones agrupadas por estado
  private calcularAsignacionesPorEstado(asignaciones: any[]): DatosGrafica[] {
    if (!asignaciones || asignaciones.length === 0) return [];

    const agrupados: { [key: string]: number } = {};
    
    asignaciones.forEach(asignacion => {
      if (asignacion.estado) {
        agrupados[asignacion.estado] = (agrupados[asignacion.estado] || 0) + 1;
      }
    });

    const total = asignaciones.length;
    
    return Object.entries(agrupados).map(([estado, cantidad]) => ({
      etiqueta: estado,
      valor: cantidad as number,
      color: this.coloresPorEstado[estado] || "#6b7280",
      porcentaje: ((cantidad as number) / total) * 100
    }));
  }
}