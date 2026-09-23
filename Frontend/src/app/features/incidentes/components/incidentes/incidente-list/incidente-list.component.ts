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
import { IncidenteService } from "../../../services/incidente.service";
import { Incidente } from "../../../models/incidente.model";
import { IncidenteFormComponent } from "../incidente-form/incidente-form.component";
import { ConfirmDialogComponent } from "../../../../logistica/components/confirm-dialog/confirm-dialog.component";
import { FechaFormateadaPipe } from "../../../pipes/fecha-formateada.pipe";
import { NivelEmergenciaPipe } from "../../../pipes/nivel-emergencia.pipe";
import { EstadoIncidentePipe } from "../../../pipes/estado-incidente.pipe";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-incidente-list",
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
    ConfirmDialogComponent,
    FechaFormateadaPipe,
    NivelEmergenciaPipe,
    EstadoIncidentePipe
  ],
  templateUrl: "./incidente-list.component.html",
  styleUrls: ["./incidente-list.component.css"]
})
export class IncidenteListComponent implements OnInit {
  incidentes: Incidente[] = []; // Lista de incidentes cargados desde el backend
  filtroActivo: string = "todos"; // Filtro activo seleccionado por el usuario
  busqueda: string = ""; // Término de búsqueda ingresado en el input
  loading: boolean = true; // Indicador de estado de carga de datos
  
  mostrarDialogoEliminacion: boolean = false; // Controla la visibilidad del diálogo de confirmación
  incidenteSeleccionadoParaEliminar: Incidente | null = null; // Almacena el incidente seleccionado para eliminar

  // Configuración de filtros hexagonales disponibles con sus iconos
  filtros = [
    { id: "todos", etiqueta: "Todos", icono: "dashboard" },
    { id: "INUNDACION", etiqueta: "Inundaciones", icono: "flood" },
    { id: "TERREMOTO", etiqueta: "Terremotos", icono: "landslide" },
    { id: "INCENDIO", etiqueta: "Incendios", icono: "local_fire_department" },
    { id: "DESLIZAMIENTO", etiqueta: "Deslizamientos", icono: "landscape" },
    { id: "ACTIVIDAD_VOLCANICA", etiqueta: "Volcanes", icono: "volcano" },
    { id: "OTRO", etiqueta: "Otros", icono: "warning" }
  ];

  // Mapa de iconos según el nivel de emergencia
  private iconosPorNivel: { [key: string]: string } = {
    CRITICA: "dangerous",
    ALTA: "warning",
    MEDIA: "info",
    BAJA: "check_circle"
  };

  // Mapa de colores según el nivel de emergencia
  private coloresPorNivel: { [key: string]: string } = {
    CRITICA: "#1a1a2e",
    ALTA: "#dc2626",
    MEDIA: "#f59e0b",
    BAJA: "#10b981"
  };

  // Inyección de dependencias del componente
  constructor(
    private incidenteService: IncidenteService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Método del ciclo de vida que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarIncidentes();
  }

  // Obtiene todos los incidentes desde el backend
  cargarIncidentes(): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.incidenteService.getAll().subscribe({
      next: (data: Incidente[]) => {
        this.incidentes = [...(data || [])];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Error al cargar incidentes:", error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Abre el modal para crear un nuevo incidente
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(IncidenteFormComponent, {
      width: "700px",
      data: { modo: "crear" },
      panelClass: "modal-cyberpunk",
      backdropClass: "backdrop-cyberpunk"
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.loading = true;
        this.cdr.markForCheck();
        setTimeout(() => this.cargarIncidentes(), 600);
      }
    });
  }

  // Abre el modal para editar un incidente existente
  abrirModalEditar(incidente: Incidente): void {
    const dialogRef = this.dialog.open(IncidenteFormComponent, {
      width: "700px",
      data: { modo: "editar", incidente },
      panelClass: "modal-cyberpunk",
      backdropClass: "backdrop-cyberpunk"
    });
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.loading = true;
        this.cdr.markForCheck();
        setTimeout(() => this.cargarIncidentes(), 600);
      }
    });
  }

  // Prepara la eliminación mostrando el diálogo de confirmación personalizado
  prepararEliminacion(incidente: Incidente): void {
    this.incidenteSeleccionadoParaEliminar = incidente;
    this.mostrarDialogoEliminacion = true;
  }

  // Cierra el diálogo de eliminación sin realizar cambios
  cerrarDialogoEliminacion(): void {
    this.mostrarDialogoEliminacion = false;
    this.incidenteSeleccionadoParaEliminar = null;
  }

  // Confirma y ejecuta la eliminación del incidente en el backend
  confirmarEliminacion(): void {
    if (!this.incidenteSeleccionadoParaEliminar?.id) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.incidenteService.delete(this.incidenteSeleccionadoParaEliminar.id).subscribe({
      next: () => {
        this.cerrarDialogoEliminacion();
        setTimeout(() => this.cargarIncidentes(), 600);
      },
      error: (error) => {
        console.error("Error al eliminar incidente:", error);
        this.loading = false;
        this.cerrarDialogoEliminacion();
        this.cdr.markForCheck();
      }
    });
  }

  // Establece el filtro activo seleccionado por el usuario
  setFiltro(filtroId: string): void {
    this.filtroActivo = filtroId;
  }

  // Obtiene los incidentes filtrados según el filtro activo y la búsqueda
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

  // Obtiene el nivel de emergencia del incidente (maneja variaciones de nombre)
  getNivelEmergencia(incidente: any): string {
    return incidente.nivelEmergencia || incidente.nivel_emergencia || "BAJA";
  }

  // Obtiene la cantidad de personas afectadas (maneja variaciones de nombre)
  getPersonasAfectadas(incidente: any): number {
    return incidente.personasAfectadas ?? incidente.cantidad_personas_afectadas ?? 0;
  }

  // Obtiene el icono correspondiente al nivel de emergencia
  getIconoNivel(nivel: string): string {
    return this.iconosPorNivel[nivel] || "help";
  }

  // Obtiene el color correspondiente al nivel de emergencia
  getColorNivel(nivel: string): string {
    return this.coloresPorNivel[nivel] || "#6b7280";
  }

  // Obtiene la clase CSS para el hexágono según el tipo
  getHexagonClass(tipoId: string): string {
    const clases: { [key: string]: string } = {
      "todos": "hex-todos",
      "INUNDACION": "hex-inundacion",
      "TERREMOTO": "hex-terremoto",
      "INCENDIO": "hex-incendio",
      "DESLIZAMIENTO": "hex-deslizamiento",
      "ACTIVIDAD_VOLCANICA": "hex-volcan",
      "OTRO": "hex-otro"
    };
    return clases[tipoId] || "hex-otro";
  }
}