// src/app/features/incidentes/components/historial/historial-detail/historial-detail.component.ts

import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HistorialService } from "../../../services/historial.service";
import { HistorialIncidente } from "../../../models/historial-incidente.model";

@Component({
  selector: "app-historial-detail",
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./historial-detail.component.html",
  styleUrls: ["./historial-detail.component.css"]
})
export class HistorialDetailComponent implements OnInit {
  historial: HistorialIncidente | null = null;
  loading: boolean = true;
  error: string = "";

  constructor(
    private historialService: HistorialService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (!idParam) {
      this.error = "No se encontró el ID del registro.";
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    const id = Number(idParam);
    if (isNaN(id)) {
      this.error = "El ID del registro no es válido.";
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = "";

    this.historialService.getById(id).subscribe({
      next: (data: HistorialIncidente | null) => {
        this.historial = data;
        if (!data) {
          this.error = "No se encontró el registro solicitado.";
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al cargar el detalle del historial:", error);
        this.historial = null;
        this.error = "No fue posible cargar el registro.";
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  volver(): void {
    this.router.navigate(["/incidentes/historial"]);
  }

  formatearFecha(fecha: Date | string | undefined): string {
    if (!fecha) return "Sin fecha";
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) return "Fecha inválida";
    return dateObj.toLocaleDateString("es-GT", {
      day: "2-digit", month: "2-digit", year: "numeric"
    });
  }

  formatearHora(fecha: Date | string | undefined): string {
    if (!fecha) return "--:--";
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) return "--:--";
    return dateObj.toLocaleTimeString("es-GT", {
      hour: "2-digit", minute: "2-digit"
    });
  }

  getEstadoAnterior(): string {
    return this.historial?.estado_anterior || "Sin estado anterior";
  }

  getComentario(): string {
    return this.historial?.comentario || "Sin comentario";
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

  recargar(): void {
    this.cargarHistorial();
  }
}