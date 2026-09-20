import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { AsignacionPersonalService } from "../../../services/asignacion-personal.service";
import { AsignacionPersonal } from "../../../models/asignacion-personal.model";
import {
  AsignacionPersonalFormComponent
} from "../asignacion-personal-form/asignacion-personal-form.component";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-asignacion-personal-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./asignacion-personal-list.component.html",
  styleUrls: ["./asignacion-personal-list.component.css"]
})
export class AsignacionPersonalListComponent implements OnInit {

  // ============================================
  // Variables
  // ============================================

  // Lista de asignaciones obtenidas del backend
  asignaciones: AsignacionPersonal[] = [];

  // Filtro activo seleccionado
  filtroActivo: string = "todos";

  // Término de búsqueda
  busqueda: string = "";

  // Indica si los datos están cargando
  loading: boolean = true;


  // ============================================
  // Filtros
  // ============================================

  // Define los filtros disponibles para las asignaciones
  filtros = [
    {
      id: "todos",
      etiqueta: "Todas",
      icono: "assignment"
    },
    {
      id: "ASIGNADO",
      etiqueta: "Asignadas",
      icono: "person_add"
    },
    {
      id: "EN_CAMINO",
      etiqueta: "En camino",
      icono: "directions_run"
    },
    {
      id: "ACTIVO",
      etiqueta: "Activas",
      icono: "person"
    },
    {
      id: "FINALIZADO",
      etiqueta: "Finalizadas",
      icono: "task_alt"
    }
  ];


  // ============================================
  // Constructor
  // ============================================

  constructor(
    private asignacionPersonalService: AsignacionPersonalService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}


  // ============================================
  // Inicialización
  // ============================================

  ngOnInit(): void {
    this.cargarAsignaciones();
  }


  // ============================================
  // Cargar asignaciones
  // ============================================

  cargarAsignaciones(): void {

    this.loading = true;

    this.asignacionPersonalService.getAll().subscribe({

      next: (data) => {

        console.log(
          "Asignaciones de personal cargadas:",
          data
        );

        this.asignaciones = data;

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          "Error al cargar las asignaciones de personal:",
          error
        );

        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }


  // ============================================
  // Crear asignación
  // ============================================

  abrirModalCrear(): void {

    const dialogRef = this.dialog.open(
      AsignacionPersonalFormComponent,
      {
        width: "600px",

        data: {
          modo: "crear"
        }
      }
    );

    dialogRef.afterClosed().subscribe(
      resultado => {

        if (resultado) {
          this.cargarAsignaciones();
        }

      }
    );
  }


  // ============================================
  // Editar asignación
  // ============================================

  abrirModalEditar(
    asignacion: AsignacionPersonal
  ): void {

    const dialogRef = this.dialog.open(
      AsignacionPersonalFormComponent,
      {
        width: "600px",

        data: {
          modo: "editar",
          asignacionPersonal: asignacion
        }
      }
    );

    dialogRef.afterClosed().subscribe(
      resultado => {

        if (resultado) {
          this.cargarAsignaciones();
        }

      }
    );
  }


  // ============================================
  // Eliminar asignación
  // ============================================

  eliminarAsignacion(id: number): void {

    if (
      confirm(
        "¿Estás seguro de eliminar esta asignación de personal?"
      )
    ) {

      this.asignacionPersonalService
        .delete(id)
        .subscribe({

          next: () => {

            this.cargarAsignaciones();

          },

          error: (error) => {

            console.error(
              "Error al eliminar la asignación:",
              error
            );

          }

        });
    }
  }


  // ============================================
  // Filtros
  // ============================================

  // Establece el filtro activo
  setFiltro(filtroId: string): void {

    this.filtroActivo = filtroId;
  }


  // Obtiene las asignaciones filtradas
  get asignacionesFiltradas(): AsignacionPersonal[] {

    let resultado = this.asignaciones;


    // --------------------------------------------
    // Filtro por estado
    // --------------------------------------------

    if (this.filtroActivo !== "todos") {

      resultado = resultado.filter(
        asignacion =>
          asignacion.estado === this.filtroActivo
      );
    }


    // --------------------------------------------
    // Filtro por búsqueda
    // --------------------------------------------

    if (this.busqueda) {

      const busquedaLower =
        this.busqueda
          .toLowerCase()
          .trim();

      resultado = resultado.filter(
        asignacion => {

          const usuarioId =
            asignacion.usuario_id
              ?.toString() || "";

          const incidenteId =
            asignacion.incidente_id
              ?.toString() || "";

          const refugioId =
            asignacion.refugio_id
              ?.toString() || "";

          const rol =
            asignacion.rol_asignado
              ?.toLowerCase() || "";

          const estado =
            asignacion.estado
              ?.toLowerCase() || "";

          const fechaAsignacion =
            asignacion.fecha_asignacion
              ?.toString()
              .toLowerCase() || "";

          const fechaFinalizacion =
            asignacion.fecha_finalizacion
              ?.toString()
              .toLowerCase() || "";

          const observaciones =
            asignacion.observaciones
              ?.toLowerCase() || "";


          return (

            usuarioId.includes(
              busquedaLower
            ) ||

            incidenteId.includes(
              busquedaLower
            ) ||

            refugioId.includes(
              busquedaLower
            ) ||

            rol.includes(
              busquedaLower
            ) ||

            estado.includes(
              busquedaLower
            ) ||

            fechaAsignacion.includes(
              busquedaLower
            ) ||

            fechaFinalizacion.includes(
              busquedaLower
            ) ||

            observaciones.includes(
              busquedaLower
            )

          );
        }
      );
    }


    return resultado;
  }


  // ============================================
  // Colores según estado
  // ============================================

  getColorEstado(estado: string): string {
    const colores: {
      [key: string]: string
    } = {

      ASIGNADO:
        "bg-blue-100 text-blue-700",

      EN_CAMINO:
        "bg-amber-100 text-amber-700",

      ACTIVO:
        "bg-emerald-100 text-emerald-700",

      FINALIZADO:
        "bg-purple-100 text-purple-700"
    };

    return (
      colores[estado] ||
      "bg-gray-100 text-gray-700"
    );
  }


  // ============================================
  // Iconos según estado
  // ============================================

  getIconoEstado(estado: string): string {
    const iconos: {
      [key: string]: string
    } = {

      ASIGNADO:
        "person_add",

      EN_CAMINO:
        "directions_run",

      ACTIVO:
        "person",

      FINALIZADO:
        "task_alt"
    };

    return (
      iconos[estado] ||
      "assignment"
    );
  }


  // ============================================
  // Colores según rol
  // ============================================

  getColorRol(rol: string): string {
    const colores: {
      [key: string]: string
    } = {

      COORDINACION:
        "bg-purple-100 text-purple-700",

      RESCATE:
        "bg-red-100 text-red-700",

      APOYO:
        "bg-blue-100 text-blue-700",

      LOGISTICA:
        "bg-amber-100 text-amber-700",

      GESTION_REFUGIO:
        "bg-emerald-100 text-emerald-700"
    };

    return (
      colores[rol] ||
      "bg-gray-100 text-gray-700"
    );
  }


  // ============================================
  // Iconos según rol
  // ============================================

  getIconoRol(rol: string): string {
    const iconos: {
      [key: string]: string
    } = {

      COORDINACION:
        "supervisor_account",

      RESCATE:
        "medical_services",

      APOYO:
        "support_agent",

      LOGISTICA:
        "inventory_2",

      GESTION_REFUGIO:
        "home"
    };

    return (
      iconos[rol] ||
      "assignment_ind"
    );
  }


  // ============================================
  // Formatear fecha
  // ============================================

  formatearFecha(
    fecha: Date | string | null | undefined
  ): string {

    if (!fecha) {
      return "Sin fecha";
    }


    const fechaObj =
      new Date(fecha);


    if (
      isNaN(
        fechaObj.getTime()
      )
    ) {

      return fecha.toString();
    }


    return fechaObj.toLocaleString(
      "es-GT",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  }
}