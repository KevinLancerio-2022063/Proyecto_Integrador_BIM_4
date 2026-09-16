import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { IncidenteService } from "../../../services/incidente.service";
import { Incidente } from "../../../models/incidente.model";
import { IncidenteFormComponent } from "../incidente-form/incidente-form.component";

@Component({
  selector: "app-incidente-list",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: "./incidente-list.component.html",
  styleUrls: ["./incidente-list.component.css"]
})
export class IncidenteListComponent implements OnInit {
  incidentes: Incidente[] = [];
  filtroActivo: string = "todos";
  busqueda: string = "";
  loading: boolean = true;

  filtros = [
    { id: "todos", etiqueta: "Todos", icono: "dashboard" },
    { id: "INUNDACION", etiqueta: "Inundaciones", icono: "flood" },
    { id: "TERREMOTO", etiqueta: "Terremotos", icono: "landslide" },
    { id: "INCENDIO", etiqueta: "Incendios", icono: "local_fire_department" },
    { id: "DESLIZAMIENTO", etiqueta: "Deslizamientos", icono: "landscape" },
    { id: "ACTIVIDAD_VOLCANICA", etiqueta: "Volcanes", icono: "volcano" },
    { id: "OTRO", etiqueta: "Otros", icono: "warning" }
  ];

  constructor(
    private incidenteService: IncidenteService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarIncidentes();
  }

  cargarIncidentes(): void {
  this.loading = true;
  
  this.incidenteService.getAll().subscribe({
    next: (data: Incidente[]) => {
      this.incidentes = data || [];
      this.loading = false; 
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error("Error al cargar incidentes:", error);
      this.loading = false; 
      this.cdr.detectChanges(); 
    }
  });
}

  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(IncidenteFormComponent, {
      width: '600px',
      disableClose: true,
      panelClass: 'modal-transparente-panel' 
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.cargarIncidentes();
      }
    });
  }

  abrirModalEditar(incidente: Incidente): void {
    const dialogRef = this.dialog.open(IncidenteFormComponent, {
      width: "600px",
      data: { modo: "editar", incidente },
      panelClass: 'modal-transparente-panel'
    });
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.cargarIncidentes();
      }
    });
  }

  eliminarIncidente(incidenteObj: any): void {
    const idReal = incidenteObj.id || incidenteObj._id;

    if (!idReal) {
      console.error("No se encontró un ID válido para eliminar");
      return;
    }

    if (confirm("¿Estás seguro de eliminar este incidente?")) {
      this.incidenteService.delete(idReal).subscribe({
        next: () => {
          this.incidentes = this.incidentes.filter(i => (i.id || (i as any)._id) !== idReal);
          this.cdr.detectChanges();
        },
        error: (error) => console.error("Error al eliminar incidente:", error)
      });
    }
  }

  setFiltro(filtroId: string): void {
    this.filtroActivo = filtroId;
  }

  get incidentesFiltrados(): Incidente[] {
    let resultado = this.incidentes;

    if (this.filtroActivo !== "todos") {
      resultado = resultado.filter((i) => i.tipo === this.filtroActivo);
    }

    if (this.busqueda) {
      const busquedaLower = this.busqueda.toLowerCase();
      resultado = resultado.filter(
        (i) =>
          i.titulo?.toLowerCase().includes(busquedaLower) ||
          i.descripcion?.toLowerCase().includes(busquedaLower) ||
          i.observaciones?.toLowerCase().includes(busquedaLower)
      );
    }

    return resultado;
  }

  getNivelEmergencia(incidente: any): string {
    return incidente.nivelEmergencia || incidente.nivel_emergencia || 'BAJA';
  }

  getPersonasAfectadas(incidente: any): number {
    return incidente.personasAfectadas ?? incidente.cantidad_personas_afectadas ?? 0;
  }

  getColorNivel(nivel: string): string {
    const colores: { [key: string]: string } = {
      BAJA: "bg-info text-dark",
      MEDIA: "bg-warning text-dark",
      ALTA: "bg-danger text-white",
      CRITICA: "bg-dark text-white"
    };
    return colores[nivel] || "bg-secondary text-white";
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

  getIconoTipo(tipo: string): string {
    const iconos: { [key: string]: string } = {
      INUNDACION: "flood",
      TERREMOTO: "landslide",
      INCENDIO: "local_fire_department",
      DESLIZAMIENTO: "landscape",
      ACTIVIDAD_VOLCANICA: "volcano",
      OTRO: "warning"
    };
    return iconos[tipo] || "report_problem";
  }
}