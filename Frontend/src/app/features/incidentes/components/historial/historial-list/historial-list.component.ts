import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HistorialService } from "../../../services/historial.service";
import { MatSelectModule } from "@angular/material/select";
import { EstadoHistorialPipe } from "../../../pipes/estado-historial.pipe";
import { FechaFormateadaPipe } from "../../../pipes/fecha-formateada.pipe";
import { ConfirmDialogComponent } from "../../../../logistica/components/confirm-dialog/confirm-dialog.component";
import { HistorialIncidente, CrearHistorialIncidenteDTO } from "../../../models/historial-incidente.model";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-historial-list",
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule,
    EstadoHistorialPipe, FechaFormateadaPipe, ConfirmDialogComponent, MatSelectModule
  ],
  templateUrl: "./historial-list.component.html",
  styleUrls: ["./historial-list.component.css"]
})
export class HistorialListComponent implements OnInit {
  historiales: HistorialIncidente[] = []; // Lista de registros del historial
  busqueda = ""; // Término de búsqueda
  loading = true; // Indicador de carga
  filtroActivo = "todos"; // Filtro activo seleccionado
  mostrarFormulario = false; // Controla visibilidad del formulario
  guardando = false; // Indicador de guardado
  mensajeError = ""; // Mensaje de error
  historialEditandoId: number | null = null; // ID del registro en edición
  
  mostrarDialogoEliminacion: boolean = false; // Controla visibilidad del diálogo de eliminación
  historialSeleccionadoParaEliminar: HistorialIncidente | null = null; // Registro seleccionado para eliminar

  // Datos del nuevo historial
  nuevoHistorial: CrearHistorialIncidenteDTO = {
    incidente_id: 0, estado_nuevo: "REPORTADO", estado_anterior: "", comentario: "", usuario_id: undefined
  };

  // Mapa de iconos según el estado
  private iconosPorEstado: { [key: string]: string } = {
    REPORTADO: "report_problem",
    EN_ATENCION: "engineering",
    MITIGADO: "healing",
    CERRADO: "check_circle"
  };

  // Mapa de colores según el estado
  private coloresPorEstado: { [key: string]: string } = {
    REPORTADO: "#dc2626",
    EN_ATENCION: "#f59e0b",
    MITIGADO: "#10b981",
    CERRADO: "#10b981"
  };

  // Inyección de dependencias
  constructor(private historialService: HistorialService, private cdr: ChangeDetectorRef) {}

  // Método del ciclo de vida al inicializar
  ngOnInit(): void { this.cargarHistorial(); }

  // Carga todos los registros del historial desde el backend
  cargarHistorial(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.historialService.getAll().subscribe({
      next: (data: HistorialIncidente[]) => {
        this.historiales = [...(data || [])];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Error al cargar historial:", error);
        this.historiales = [];
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Abre el formulario para crear un nuevo registro
  abrirFormularioCrear(): void {
    this.historialEditandoId = null;
    this.mensajeError = "";
    this.nuevoHistorial = { incidente_id: 0, estado_nuevo: "REPORTADO", estado_anterior: "", comentario: "", usuario_id: undefined };
    this.mostrarFormulario = true;
  }

  // Cierra el formulario de creación
  cerrarFormularioCrear(): void {
    if (this.guardando) return;
    this.mostrarFormulario = false;
    this.mensajeError = "";
  }

  // Guarda el nuevo registro en el historial
  guardarHistorial(): void {
    this.mensajeError = "";
    if (this.historialEditandoId !== null) {
      this.actualizarHistorial();
      return;
    }

    if (!this.nuevoHistorial.incidente_id || this.nuevoHistorial.incidente_id <= 0) {
      this.mensajeError = "Debes ingresar un ID de incidente válido.";
      return;
    }

    this.guardando = true;
    const datos: CrearHistorialIncidenteDTO = {
      incidente_id: Number(this.nuevoHistorial.incidente_id),
      estado_nuevo: this.nuevoHistorial.estado_nuevo,
      estado_anterior: this.nuevoHistorial.estado_anterior?.trim() || undefined,
      comentario: this.nuevoHistorial.comentario?.trim() || undefined,
      usuario_id: this.nuevoHistorial.usuario_id ? Number(this.nuevoHistorial.usuario_id) : undefined
    };

    this.historialService.create(datos).subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.mensajeError = "";
        this.cargarHistorial();
      },
      error: (error) => {
        console.error("Error al crear historial:", error);
        this.guardando = false;
        this.mensajeError = "No fue posible guardar el historial.";
        this.cdr.detectChanges();
      }
    });
  }

  // Abre el formulario para editar un registro existente
  abrirFormularioEditar(historial: HistorialIncidente): void {
    this.mensajeError = "";
    this.historialEditandoId = Number(historial.id);
    this.nuevoHistorial = {
      incidente_id: Number(historial.incidente_id),
      estado_nuevo: historial.estado_nuevo,
      estado_anterior: historial.estado_anterior || "",
      comentario: historial.comentario || "",
      usuario_id: historial.usuario_id
    };
    this.mostrarFormulario = true;
  }

  // Actualiza un registro existente del historial
  actualizarHistorial(): void {
    const comentario = this.nuevoHistorial.comentario?.trim();
    if (!comentario) {
      this.mensajeError = "El comentario no puede estar vacío.";
      return;
    }

    this.guardando = true;
    this.historialService.update(this.historialEditandoId!, { id: this.historialEditandoId!, comentario }).subscribe({
      next: () => {
        this.guardando = false;
        this.mostrarFormulario = false;
        this.historialEditandoId = null;
        this.cargarHistorial();
      },
      error: (error) => {
        console.error("Error al actualizar historial:", error);
        this.guardando = false;
        this.mensajeError = "No fue posible actualizar el historial.";
        this.cdr.detectChanges();
      }
    });
  }

  // Prepara la eliminación mostrando el diálogo de confirmación
  prepararEliminacion(historial: HistorialIncidente): void {
    this.historialSeleccionadoParaEliminar = historial;
    this.mostrarDialogoEliminacion = true;
  }

  // Cierra el diálogo de eliminación
  cerrarDialogoEliminacion(): void {
    this.mostrarDialogoEliminacion = false;
    this.historialSeleccionadoParaEliminar = null;
  }

  // Confirma y ejecuta la eliminación del registro
  confirmarEliminacion(): void {
    if (!this.historialSeleccionadoParaEliminar) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.historialService.delete(Number(this.historialSeleccionadoParaEliminar.id)).subscribe({
      next: () => {
        this.cerrarDialogoEliminacion();
        setTimeout(() => this.cargarHistorial(), 600);
      },
      error: (error) => {
        console.error("Error al eliminar historial:", error);
        this.loading = false;
        this.cerrarDialogoEliminacion();
        this.cdr.markForCheck();
      }
    });
  }

  // Establece el filtro activo
  setFiltro(filtro: string): void { this.filtroActivo = filtro; }

  // Obtiene los registros filtrados según el filtro y búsqueda
  get historialesFiltrados(): HistorialIncidente[] {
    let resultado = this.historiales;
    if (this.filtroActivo !== "todos") {
      resultado = resultado.filter(h => h.estado_nuevo === this.filtroActivo);
    }
    if (this.busqueda.trim()) {
      const texto = this.busqueda.toLowerCase().trim();
      resultado = resultado.filter(h =>
        h.id?.toString().includes(texto) ||
        h.incidente_id?.toString().includes(texto) ||
        h.estado_anterior?.toLowerCase().includes(texto) ||
        h.estado_nuevo?.toLowerCase().includes(texto) ||
        h.comentario?.toLowerCase().includes(texto) ||
        h.usuario_id?.toString().includes(texto)
      );
    }
    return resultado;
  }

  // Obtiene el comentario o retorna valor por defecto
  getComentario(historial: HistorialIncidente): string {
    return historial.comentario || "Sin comentario";
  }

  // Obtiene el icono correspondiente al estado
  getIconoEstado(estado: string): string {
    return this.iconosPorEstado[estado] || "help";
  }

  // Obtiene el color correspondiente al estado
  getColorEstado(estado: string): string {
    return this.coloresPorEstado[estado] || "#6b7280";
  }

  // Lista de estados disponibles para el formulario
  estadosDisponibles = [
    { valor: "REPORTADO", texto: "Reportado", icono: "report_problem", color: "#ef4444" },
    { valor: "EN_ATENCION", texto: "En Atención", icono: "engineering", color: "#f59e0b" },
    { valor: "MITIGADO", texto: "Mitigado", icono: "healing", color: "#10b981" },
    { valor: "CERRADO", texto: "Cerrado", icono: "check_circle", color: "#6b7280" }
  ];

  // Obtiene la clase CSS para el hexágono según el estado
  getHexagonClass(estadoId: string): string {
    const clases: { [key: string]: string } = {
      "todos": "hex-todos",
      "REPORTADO": "hex-reportado",
      "EN_ATENCION": "hex-atencion",
      "MITIGADO": "hex-mitigado",
      "CERRADO": "hex-cerrado"
    };
    return clases[estadoId] || "hex-otro";
  }

  // Recarga los datos del historial
  recargar(): void { this.cargarHistorial(); }
}
