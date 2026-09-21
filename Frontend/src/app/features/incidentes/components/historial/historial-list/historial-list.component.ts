import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HistorialService } from "../../../services/historial.service";
import { EstadoHistorialPipe } from "../../../pipes/estado-historial.pipe";
import { FechaFormateadaPipe } from "../../../pipes/fecha-formateada.pipe";
import {
  HistorialIncidente,
  CrearHistorialIncidenteDTO
} from "../../../models/historial-incidente.model";

@Component({
  selector: "app-historial-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    EstadoHistorialPipe,
    FechaFormateadaPipe
  ],
  templateUrl: "./historial-list.component.html",
  styleUrls: ["./historial-list.component.css"]
})
export class HistorialListComponent implements OnInit {

  historiales: HistorialIncidente[] = [];
  busqueda = "";
  loading = true;
  filtroActivo = "todos";
  mostrarFormulario = false;
  guardando = false;
  mensajeError = "";
  historialEditandoId: number | null = null;
  nuevoHistorial: CrearHistorialIncidenteDTO = {
    incidente_id: 0,
    estado_nuevo: "REPORTADO",
    estado_anterior: "",
    comentario: "",
    usuario_id: undefined
  };

  constructor(
    private historialService: HistorialService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.loading = true;

    this.historialService.getAll().subscribe({
      next: (data: HistorialIncidente[]) => {
        this.historiales = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al cargar historial:", error);

        this.historiales = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirFormularioCrear(): void {
    this.historialEditandoId = null;
    this.mensajeError = "";
    this.nuevoHistorial = {
      incidente_id: 0,
      estado_nuevo: "REPORTADO",
      estado_anterior: "",
      comentario: "",
      usuario_id: undefined
    };

    this.mostrarFormulario = true;
  }

  cerrarFormularioCrear(): void {
    if (this.guardando) {
      return;
    }

    this.mostrarFormulario = false;
    this.mensajeError = "";
  }

  guardarHistorial(): void {
    this.mensajeError = "";

    if (this.historialEditandoId !== null) {
      this.actualizarHistorial();
      return;
    }

    if (
      !this.nuevoHistorial.incidente_id ||
      this.nuevoHistorial.incidente_id <= 0
    ) {
      this.mensajeError = "Debes ingresar un ID de incidente válido.";
      return;
    }

    if (!this.nuevoHistorial.estado_nuevo) {
      this.mensajeError = "Debes seleccionar un estado.";
      return;
    }

    this.guardando = true;

    const datos: CrearHistorialIncidenteDTO = {
      incidente_id: Number(this.nuevoHistorial.incidente_id),
      estado_nuevo: this.nuevoHistorial.estado_nuevo,
      estado_anterior:
        this.nuevoHistorial.estado_anterior?.trim() || undefined,
      comentario:
        this.nuevoHistorial.comentario?.trim() || undefined,
      usuario_id: this.nuevoHistorial.usuario_id
        ? Number(this.nuevoHistorial.usuario_id)
        : undefined
    };

    this.historialService.create(datos).subscribe({
      next: (respuesta) => {
        console.log("Historial creado:", respuesta);

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

  actualizarHistorial(): void {
    const comentario = this.nuevoHistorial.comentario?.trim();

    if (!comentario) {
      this.mensajeError = "El comentario no puede estar vacío.";
      return;
    }

    const id = this.historialEditandoId!;
    this.guardando = true;

    this.historialService.update(id, { id, comentario }).subscribe({
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

  eliminarHistorial(historial: HistorialIncidente): void {
    if (!confirm(`¿Eliminar el registro #${historial.id} del historial?`)) {
      return;
    }

    this.historialService.delete(Number(historial.id)).subscribe({
      next: () => this.cargarHistorial(),
      error: (error) => console.error("Error al eliminar historial:", error)
    });
  }

  setFiltro(filtro: string): void {
    this.filtroActivo = filtro;
  }

  get historialesFiltrados(): HistorialIncidente[] {
    let resultado = this.historiales;

    if (this.filtroActivo !== "todos") {
      resultado = resultado.filter(
        historial => historial.estado_nuevo === this.filtroActivo
      );
    }

    if (this.busqueda.trim()) {
      const texto = this.busqueda.toLowerCase().trim();

      resultado = resultado.filter(
        historial =>
          historial.id?.toString().includes(texto) ||
          historial.incidente_id?.toString().includes(texto) ||
          historial.estado_anterior?.toLowerCase().includes(texto) ||
          historial.estado_nuevo?.toLowerCase().includes(texto) ||
          historial.comentario?.toLowerCase().includes(texto) ||
          historial.usuario_id?.toString().includes(texto)
      );
    }

    return resultado;
  }

  getComentario(historial: HistorialIncidente): string {
    return historial.comentario || "Sin comentario";
  }

  recargar(): void {
    this.cargarHistorial();
  }
}