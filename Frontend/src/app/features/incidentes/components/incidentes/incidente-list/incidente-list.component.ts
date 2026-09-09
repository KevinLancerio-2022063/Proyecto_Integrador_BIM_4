import { Component, OnInit } from "@angular/core";
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
  // Almacena la lista de incidentes obtenidos del backend
  incidentes: Incidente[] = [];

  // Almacena el filtro activo seleccionado
  filtroActivo: string = "todos";

  // Almacena el término de búsqueda
  busqueda: string = "";

  // Indica si los datos están cargando
  loading: boolean = true;

  // Filtros disponibles basados en el enum tipo de Incidente
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarIncidentes();
  }

  // Llama al servicio para obtener los incidentes
  cargarIncidentes(): void {
    this.loading = true;
    this.incidenteService.getAll().subscribe({
      next: (data: Incidente[]) => {
        // Asignación directa: el servicio ya retornó el arreglo limpio mediante .pipe(map(...))
        this.incidentes = data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error("Error al cargar incidentes:", error);
        this.loading = false;
      }
    });
  }

  // Abre el modal para reportar/crear un incidente
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(IncidenteFormComponent, {
      width: "600px",
      data: { modo: "crear" }
    });
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) this.cargarIncidentes();
    });
  }

  // Abre el modal para editar un incidente
  abrirModalEditar(incidente: Incidente): void {
    const dialogRef = this.dialog.open(IncidenteFormComponent, {
      width: "600px",
      data: { modo: "editar", incidente }
    });
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) this.cargarIncidentes();
    });
  }

  // Elimina un incidente tras confirmación
  eliminarIncidente(id: number): void {
    if (confirm("¿Estás seguro de eliminar este incidente?")) {
      this.incidenteService.delete(id).subscribe({
        next: () => this.cargarIncidentes(),
        error: (error) => console.error("Error al eliminar incidente:", error)
      });
    }
  }

  // Establece el filtro activo por tipo
  setFiltro(filtroId: string): void {
    this.filtroActivo = filtroId;
  }

  // Filtra por tipo de incidente, título o descripción
  get incidentesFiltrados(): Incidente[] {
    let resultado = this.incidentes;

    if (this.filtroActivo !== "todos") {
      resultado = resultado.filter((i) => i.tipo === this.filtroActivo);
    }

    if (this.busqueda) {
      const busquedaLower = this.busqueda.toLowerCase();
      resultado = resultado.filter(
        (i) =>
          i.titulo.toLowerCase().includes(busquedaLower) ||
          i.descripcion?.toLowerCase().includes(busquedaLower) ||
          i.observaciones?.toLowerCase().includes(busquedaLower)
      );
    }

    return resultado;
  }

  // Color de badge según nivel de emergencia
  getColorNivel(nivel: string): string {
    const colores: { [key: string]: string } = {
      BAJA: "bg-info text-dark",
      MEDIA: "bg-warning text-dark",
      ALTA: "bg-danger text-white",
      CRITICA: "bg-dark text-white"
    };
    return colores[nivel] || "bg-secondary text-white";
  }

  // Color de badge según estado del incidente
  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      REPORTADO: "bg-warning text-dark",
      EN_ATENCION: "bg-primary text-white",
      MITIGADO: "bg-info text-dark",
      CERRADO: "bg-success text-white"
    };
    return colores[estado] || "bg-secondary text-white";
  }

  // Icono Material según el tipo de incidente
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