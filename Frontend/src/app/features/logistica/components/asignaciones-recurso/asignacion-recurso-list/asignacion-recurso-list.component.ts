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

import { AsignacionRecursoService } from "../../../services/asignacion-recurso.service";
import { AsignacionRecurso } from "../../../models/asignacion-recurso.model";

import { AsignacionRecursoFormComponent } from "../asignacion-recurso-form/asignacion-recurso-form.component";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-asignacion-recurso-list",
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
    MatProgressSpinnerModule,
    ConfirmDialogComponent
  ],
  templateUrl: "./asignacion-recurso-list.component.html",
  styleUrls: ["./asignacion-recurso-list.component.css"]
})
export class AsignacionRecursoListComponent implements OnInit {
  // Almacena la lista de asignaciones obtenidas del backend
  asignaciones: AsignacionRecurso[] = [];
  
  // Almacena el filtro activo seleccionado
  filtroActivo: string = "todos";
  
  // Almacena el término de búsqueda
  busqueda: string = "";
  
  // Indica si los datos están cargando
  loading: boolean = true;

  // Controla la visibilidad del diálogo de confirmación de eliminación
  mostrarDialogoEliminacion: boolean = false;
  
  // Almacena la asignación seleccionada para eliminar
  asignacionSeleccionadaParaEliminar: AsignacionRecurso | null = null;

  // Define los filtros disponibles para asignaciones con sus iconos
  filtros = [
    { id: "todos", etiqueta: "Todos", icono: "assignment" },
    { id: "SOLICITADO", etiqueta: "Solicitados", icono: "pending" },
    { id: "ASIGNADO", etiqueta: "Asignados", icono: "check_circle" },
    { id: "ENVIADO", etiqueta: "Enviados", icono: "local_shipping" },
    { id: "ENTREGADO", etiqueta: "Entregados", icono: "done_all" },
    { id: "CANCELADO", etiqueta: "Cancelados", icono: "cancel" }
  ];

  // Inyecta el servicio de asignaciones y el diálogo
  constructor(
    private asignacionService: AsignacionRecursoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  // Llama al servicio para obtener los datos
  cargarAsignaciones(): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.asignacionService.getAll().subscribe({
      next: (data) => {
        console.log("Asignaciones cargadas:", data);
        this.asignaciones = [...data];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Error al cargar asignaciones:", error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Abre el modal para crear una nueva asignación
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(AsignacionRecursoFormComponent, {
      width: "700px",
      data: { modo: "crear" },
      panelClass: "modal-cyberpunk",
      backdropClass: "backdrop-cyberpunk"
    });
    
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        setTimeout(() => {
          this.cargarAsignaciones();
        }, 300);
      }
    });
  }

  // Abre el modal para editar una asignación existente
  abrirModalEditar(asignacion: AsignacionRecurso): void {
    const dialogRef = this.dialog.open(AsignacionRecursoFormComponent, {
      width: "700px",
      data: { modo: "editar", asignacion },
      panelClass: "modal-cyberpunk",
      backdropClass: "backdrop-cyberpunk"
    });
    
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        setTimeout(() => {
          this.cargarAsignaciones();
        }, 300);
      }
    });
  }

  // Prepara la eliminación mostrando el diálogo de confirmación
  prepararEliminacion(asignacion: AsignacionRecurso): void {
    this.asignacionSeleccionadaParaEliminar = asignacion;
    this.mostrarDialogoEliminacion = true;
  }

  // Cierra el diálogo de eliminación sin eliminar
  cerrarDialogoEliminacion(): void {
    this.mostrarDialogoEliminacion = false;
    this.asignacionSeleccionadaParaEliminar = null;
  }

  // Confirma y ejecuta la eliminación de la asignación
  confirmarEliminacion(): void {
    if (!this.asignacionSeleccionadaParaEliminar?.id) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.asignacionService.delete(this.asignacionSeleccionadaParaEliminar.id).subscribe({
      next: () => {
        this.cerrarDialogoEliminacion();
        setTimeout(() => {
          this.cargarAsignaciones();
        }, 300);
      },
      error: (error) => {
        console.error("Error al eliminar:", error);
        this.loading = false;
        this.cerrarDialogoEliminacion();
        this.cdr.markForCheck();
      }
    });
  }

  // Establece el filtro activo
  setFiltro(filtroId: string): void {
    this.filtroActivo = filtroId;
  }

  // Obtiene las asignaciones filtradas según el filtro activo y la búsqueda
  get asignacionesFiltradas(): AsignacionRecurso[] {
    // 1. Por defecto, ocultamos las asignaciones con estado "CANCELADO" (soft delete)
    let resultado = this.asignaciones.filter(a => a.estado !== "CANCELADO");
    
    // 2. Si el usuario selecciona explícitamente el filtro "CANCELADO", las mostramos
    if (this.filtroActivo === "CANCELADO") {
      resultado = this.asignaciones.filter(a => a.estado === "CANCELADO");
    } 
    // 3. Si selecciona otro filtro específico, aplicamos ese filtro sobre el resultado ya limpio
    else if (this.filtroActivo !== "todos") {
      resultado = resultado.filter(a => a.estado === this.filtroActivo);
    }
    
    // 4. Aplica filtro por búsqueda
    if (this.busqueda) {
      const busquedaLower = this.busqueda.toLowerCase();
      resultado = resultado.filter(a => 
        a.nombre_recurso?.toLowerCase().includes(busquedaLower) ||
        a.estado.toLowerCase().includes(busquedaLower) ||
        this.getDestino(a).toLowerCase().includes(busquedaLower)
      );
    }
    
    return resultado;
  }

  // Obtiene el color del badge según el estado de la asignación
  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      SOLICITADO: "#3b82f6",
      ASIGNADO: "#8b5cf6",
      ENVIADO: "#f59e0b",
      ENTREGADO: "#10b981",
      CANCELADO: "#ef4444"
    };
    return colores[estado] || "#6b7280";
  }

  // Obtiene el destino de la asignación (incidente o refugio)
  getDestino(asignacion: AsignacionRecurso): string {
    if (asignacion.incidente_id) {
      return `Incidente #${asignacion.incidente_id}`;
    }
    if (asignacion.refugio_id) {
      return `Refugio #${asignacion.refugio_id}`;
    }
    return "Sin destino";
  }

  // Obtiene el icono del destino
  getIconoDestino(asignacion: AsignacionRecurso): string {
    return asignacion.incidente_id ? "warning" : "home";
  }

  // Obtiene la clase CSS correspondiente al hexágono según el filtro
getClaseHexagono(filtroId: string): string {
  const clases: { [key: string]: string } = {
    todos: "hex-todos",
    SOLICITADO: "hex-solicitado",
    ASIGNADO: "hex-asignado",
    ENVIADO: "hex-enviado",
    ENTREGADO: "hex-entregado",
    CANCELADO: "hex-cancelado"
  };
  return clases[filtroId] || "hex-todos";
}
}