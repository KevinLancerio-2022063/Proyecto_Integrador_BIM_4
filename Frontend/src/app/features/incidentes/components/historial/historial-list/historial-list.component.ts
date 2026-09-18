import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HistorialService } from "../../../services/historial.service";
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
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
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

  getEstadoAnterior(historial: HistorialIncidente): string {
    return historial.estado_anterior || "Sin estado anterior";
  }

  getComentario(historial: HistorialIncidente): string {
    return historial.comentario || "Sin comentario";
  }

  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      REPORTADO: "bg-warning text-dark",
      EN_ATENCION: "bg-primary text-white",
      MITIGADO: "bg-info text-dark",
      CERRADO: "bg-success text-white"
    };

    return colores[estado] || "bg-secondary text-white";
  }

  getIconoEstado(estado: string): string {
    const iconos: { [key: string]: string } = {
      REPORTADO: "report_problem",
      EN_ATENCION: "engineering",
      MITIGADO: "healing",
      CERRADO: "check_circle"
    };

    return iconos[estado] || "history";
  }

  formatearFecha(fecha: Date | string): string {
    if (!fecha) {
      return "Sin fecha";
    }

    const fechaObj = new Date(fecha);

    if (isNaN(fechaObj.getTime())) {
      return "Fecha inválida";
    }

    return fechaObj.toLocaleDateString("es-GT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  formatearHora(fecha: Date | string): string {
    if (!fecha) {
      return "--:--";
    }

    const fechaObj = new Date(fecha);

    if (isNaN(fechaObj.getTime())) {
      return "--:--";
    }

    return fechaObj.toLocaleTimeString("es-GT", {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  recargar(): void {
    this.cargarHistorial();
  }
}