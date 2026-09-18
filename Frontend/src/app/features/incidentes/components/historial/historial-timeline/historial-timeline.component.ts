import { Component, Input, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { HistorialService } from "../../../services/historial.service";
import { HistorialIncidente } from "../../../models/historial-incidente.model";

@Component({
  selector: "app-historial-timeline",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./historial-timeline.component.html",
  styleUrls: ["./historial-timeline.component.css"]
})
export class HistorialTimelineComponent implements OnInit {

  @Input() incidenteId!: number;
  historiales: HistorialIncidente[] = [];
  loading: boolean = true;
  error: string = "";

  constructor(
    private historialService: HistorialService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarTimeline();
  }

  cargarTimeline(): void {

    if (!this.incidenteId) {
      this.historiales = [];
      this.loading = false;
      this.error = "No se especificó el incidente.";
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = "";

    this.historialService.getAll().subscribe({
      next: (data: HistorialIncidente[]) => {

        this.historiales = (data || [])
          .filter(
            (historial) =>
              Number(historial.incidente_id) === Number(this.incidenteId)
          )
          .sort((a, b) => {
            const fechaA = new Date(a.fecha).getTime();
            const fechaB = new Date(b.fecha).getTime();

            return fechaA - fechaB;
          });

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          "Error al cargar el timeline del historial:",
          error
        );

        this.historiales = [];
        this.loading = false;
        this.error = "No fue posible cargar el historial del incidente.";

        this.cdr.detectChanges();
      }
    });
  }

  recargar(): void {
    this.cargarTimeline();
  }

  getEstadoAnterior(historial: HistorialIncidente): string {
    return historial.estado_anterior || "Sin estado anterior";
  }

  getComentario(historial: HistorialIncidente): string {
    return historial.comentario || "Sin comentario";
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

  getClaseEstado(estado: string): string {

    const clases: { [key: string]: string } = {
      REPORTADO: "estado-reportado",
      EN_ATENCION: "estado-atencion",
      MITIGADO: "estado-mitigado",
      CERRADO: "estado-cerrado"
    };

    return clases[estado] || "estado-default";
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

  esUltimo(index: number): boolean {
    return index === this.historiales.length - 1;
  }
}