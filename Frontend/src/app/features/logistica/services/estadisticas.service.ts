import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";

import {
  Observable,
  combineLatest,
  map,
  catchError,
  of
} from "rxjs";

import { RecursoService } from "./recurso.service";

import { RefugioService } from "./refugio.service";

import { AsignacionRecursoService } from "./asignacion-recurso.service";

// *Servicios de Operaciones*

import { AlertaService } from "../../operaciones/services/alerta.service";

import {
  AsignacionPersonalService
} from "../../operaciones/services/asignacion-personal.service";


// *============================================*
// *Interfaz para los datos de la gráfica*
// *============================================*

export interface DatosGrafica {

  etiqueta: string;

  valor: number;

  color: string;

  porcentaje: number;

}


// *============================================*
// *Interfaz para estadísticas completas*
// *============================================*

export interface Estadisticas {

  totalRecursos: number;

  totalRefugios: number;

  totalAsignaciones: number;

  recursosPorTipo: DatosGrafica[];

  ocupacionPromedioRefugios: number;

  asignacionesPorEstado: DatosGrafica[];

  // *Estadísticas de Alertas*

  alertasPorNivel: DatosGrafica[];

  // *Estadísticas de Asignación de Personal*

  asignacionesPersonalPorRol: DatosGrafica[];

}


// *============================================*
// *Servicio de estadísticas*
// *============================================*

@Injectable({

  providedIn: "root"

})

export class EstadisticasService {


  // *============================================*
  // *Colores para recursos*
  // *============================================*

  private coloresPorTipo: { [key: string]: string } = {

    AGUA: "#1fa882",

    ALIMENTO: "#e68529",

    MEDICAMENTO: "#d94141",

    EQUIPO: "#2da160",

    VEHICULO: "#e69a2e",

    OTRO: "#6b7280"

  };


  // *============================================*
  // *Colores para asignaciones de recursos*
  // *============================================*

  private coloresPorEstado: { [key: string]: string } = {

    SOLICITADO: "#00f0ff",

    ASIGNADO: "#8338ec",

    ENVIADO: "#ffbe0b",

    ENTREGADO: "#06ffa5",

    CANCELADO: "#ff006e"

  };


  // *============================================*
  // *Colores para niveles de alerta*
  // *============================================*

  private coloresPorNivelAlerta: {
    [key: string]: string
  } = {

    INFO: "#00f0ff",

    ADVERTENCIA: "#ffbe0b",

    CRITICA: "#ff006e"

  };


  // *============================================*
  // *Colores para roles de asignación de personal*
  // *============================================*

  private coloresPorRolPersonal: {
    [key: string]: string
  } = {

    COORDINACION: "#8338ec",

    RESCATE: "#ff006e",

    APOYO: "#00f0ff",

    LOGISTICA: "#ffbe0b",

    GESTION_REFUGIO: "#06ffa5"

  };


  // *============================================*
  // *Constructor*
  // *============================================*

  constructor(

    private recursoService: RecursoService,

    private refugioService: RefugioService,

    private asignacionService: AsignacionRecursoService,

    // *Servicios de operaciones*

    private alertaService: AlertaService,

    private asignacionPersonalService:
      AsignacionPersonalService

  ) {}


  // *============================================*
  // *Obtiene todas las estadísticas*
  // *============================================*

  getEstadisticasCompletas():
    Observable<Estadisticas> {

    return combineLatest([

      // *--------------------------------------------*
      // *Recursos*
      // *--------------------------------------------*

      this.recursoService.getAll().pipe(

        catchError(error => {

          console.warn(
            "Error al cargar recursos:",
            error
          );

          return of([]);

        })

      ),


      // *--------------------------------------------*
      // *Refugios*
      // *--------------------------------------------*

      this.refugioService.getAll().pipe(

        catchError(error => {

          console.warn(
            "Error al cargar refugios:",
            error
          );

          return of([]);

        })

      ),


      // *--------------------------------------------*
      // *Asignaciones de recursos*
      // *--------------------------------------------*

      this.asignacionService.getAll().pipe(

        catchError(error => {

          console.warn(
            "Error al cargar asignaciones:",
            error
          );

          return of([]);

        })

      ),


      // *--------------------------------------------*
      // *Alertas*
      // *--------------------------------------------*

      this.alertaService.getAll().pipe(

        catchError(error => {

          console.warn(
            "Error al cargar alertas:",
            error
          );

          return of([]);

        })

      ),


      // *--------------------------------------------*
      // *Asignaciones de personal*
      // *--------------------------------------------*

      this.asignacionPersonalService
        .getAll()
        .pipe(

          catchError(error => {

            console.warn(
              "Error al cargar asignaciones de personal:",
              error
            );

            return of([]);

          })

        )

    ]).pipe(


      // *============================================*
      // *Procesamiento de estadísticas*
      // *============================================*

      map(([
        recursos,
        refugios,
        asignaciones,
        alertas,
        asignacionesPersonal
      ]) => {


        console.log(
          "Datos recibidos para dashboard:",
          {

            recursos: recursos.length,

            refugios: refugios.length,

            asignaciones:
              asignaciones.length,

            alertas:
              alertas.length,

            asignacionesPersonal:
              asignacionesPersonal.length

          }
        );


        return {

          // *----------------------------------------*
          // *Estadísticas existentes*
          // *----------------------------------------*

          totalRecursos:
            recursos.length,

          totalRefugios:
            refugios.length,

          totalAsignaciones:
            asignaciones.length,

          recursosPorTipo:
            this.calcularRecursosPorTipo(
              recursos
            ),

          ocupacionPromedioRefugios:
            this.calcularOcupacionPromedio(
              refugios
            ),

          asignacionesPorEstado:
            this.calcularAsignacionesPorEstado(
              asignaciones
            ),


          // *----------------------------------------*
          // *Estadísticas nuevas*
          // *----------------------------------------*

          alertasPorNivel:
            this.calcularAlertasPorNivel(
              alertas
            ),

          asignacionesPersonalPorRol:
            this.calcularAsignacionesPersonalPorRol(
              asignacionesPersonal
            )

        };

      }),


      // *============================================*
      // *Manejo de error general*
      // *============================================*

      catchError(error => {

        console.error(
          "Error general en estadísticas:",
          error
        );

        return of({

          totalRecursos: 0,

          totalRefugios: 0,

          totalAsignaciones: 0,

          recursosPorTipo: [],

          ocupacionPromedioRefugios: 0,

          asignacionesPorEstado: [],

          alertasPorNivel: [],

          asignacionesPersonalPorRol: []

        });

      })

    );

  }


  // *============================================*
  // *Recursos por tipo*
  // *============================================*

  private calcularRecursosPorTipo(
    recursos: any[]
  ): DatosGrafica[] {

    if (
      !recursos ||
      recursos.length === 0
    ) {

      return [];

    }


    const agrupados: {
      [key: string]: number
    } = {};


    recursos.forEach(recurso => {

      if (recurso.tipo) {

        agrupados[recurso.tipo] =
          (agrupados[recurso.tipo] || 0) + 1;

      }

    });


    const total = recursos.length;


    return Object.entries(agrupados).map(
      ([tipo, cantidad]) => ({

        etiqueta: tipo,

        valor: cantidad as number,

        color:
          this.coloresPorTipo[tipo]
          || "#6b7280",

        porcentaje:
          ((cantidad as number) / total) * 100

      })
    );

  }


  // *============================================*
  // *Ocupación promedio de refugios*
  // *============================================*

  private calcularOcupacionPromedio(
    refugios: any[]
  ): number {

    if (
      !refugios ||
      refugios.length === 0
    ) {

      return 0;

    }


    const totalPorcentaje =
      refugios.reduce(
        (acc, refugio) => {

          if (
            refugio.capacidad_total &&
            refugio.capacidad_total > 0
          ) {

            const porcentaje =
              (
                refugio.ocupacion_actual /
                refugio.capacidad_total
              ) * 100;


            return acc +
              Math.min(
                porcentaje,
                100
              );

          }


          return acc;

        },
        0
      );


    return Math.round(
      totalPorcentaje /
      refugios.length
    );

  }


  // *============================================*
  // *Asignaciones de recursos por estado*
  // *============================================*

  private calcularAsignacionesPorEstado(
    asignaciones: any[]
  ): DatosGrafica[] {

    if (
      !asignaciones ||
      asignaciones.length === 0
    ) {

      return [];

    }


    const agrupados: {
      [key: string]: number
    } = {};


    asignaciones.forEach(
      asignacion => {

        if (asignacion.estado) {

          agrupados[asignacion.estado] =
            (
              agrupados[asignacion.estado]
              || 0
            ) + 1;

        }

      }
    );


    const total =
      asignaciones.length;


    return Object.entries(agrupados).map(
      ([estado, cantidad]) => ({

        etiqueta: estado,

        valor:
          cantidad as number,

        color:
          this.coloresPorEstado[estado]
          || "#6b7280",

        porcentaje:
          (
            (cantidad as number) /
            total
          ) * 100

      })
    );

  }


  // *============================================*
  // *Alertas por nivel*
  // *============================================*

  private calcularAlertasPorNivel(
    alertas: any[]
  ): DatosGrafica[] {

    if (
      !alertas ||
      alertas.length === 0
    ) {

      return [];

    }


    const agrupados: {
      [key: string]: number
    } = {};


    alertas.forEach(alerta => {

      if (alerta.nivel) {

        agrupados[alerta.nivel] =
          (
            agrupados[alerta.nivel]
            || 0
          ) + 1;

      }

    });


    const total =
      alertas.length;


    return Object.entries(agrupados).map(
      ([nivel, cantidad]) => ({

        etiqueta: nivel,

        valor:
          cantidad as number,

        color:
          this.coloresPorNivelAlerta[nivel]
          || "#6b7280",

        porcentaje:
          (
            (cantidad as number) /
            total
          ) * 100

      })
    );

  }


  // *============================================*
  // *Asignaciones de personal por rol*
  // *============================================*

  private calcularAsignacionesPersonalPorRol(
    asignaciones: any[]
  ): DatosGrafica[] {

    if (
      !asignaciones ||
      asignaciones.length === 0
    ) {

      return [];

    }


    const agrupados: {
      [key: string]: number
    } = {};


    asignaciones.forEach(
      asignacion => {

        if (
          asignacion.rol_asignado
        ) {

          agrupados[
            asignacion.rol_asignado
          ] =
            (
              agrupados[
                asignacion.rol_asignado
              ] || 0
            ) + 1;

        }

      }
    );


    const total =
      asignaciones.length;


    return Object.entries(agrupados).map(
      ([rol, cantidad]) => ({

        etiqueta: rol,

        valor:
          cantidad as number,

        color:
          this.coloresPorRolPersonal[rol]
          || "#6b7280",

        porcentaje:
          (
            (cantidad as number) /
            total
          ) * 100

      })
    );

  }

}