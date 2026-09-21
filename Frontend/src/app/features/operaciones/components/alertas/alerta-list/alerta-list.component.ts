import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { EstadoAlertaPipe } from '../../../pipes/estado-alerta.pipe';
import { NivelAlertaPipe } from '../../../pipes/nivel-alerta.pipe';
import { TipoAlertaPipe } from '../../../pipes/tipo-alerta.pipe';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { AlertaService } from "../../../services/alerta.service";
import { Alerta } from "../../../models/alerta.model";
import { AlertaFormComponent } from "../alerta-form/alerta-form.component";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-alerta-list",
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

    EstadoAlertaPipe,
    NivelAlertaPipe,
    TipoAlertaPipe
  ],
  templateUrl: "./alerta-list.component.html",
  styleUrls: ["./alerta-list.component.css"]
})
export class AlertaListComponent implements OnInit {
  // Almacena la lista de alertas obtenidas del backend
  alertas: Alerta[] = [];

  // Almacena el filtro activo seleccionado
  filtroActivo: string = "todos";

  // Almacena el término de búsqueda
  busqueda: string = "";

  // Indica si los datos están cargando
  loading: boolean = true;

  // Define los filtros disponibles para alertas con sus iconos
  filtros = [
    { id: "todos", etiqueta: "Todas", icono: "notifications" },
    { id: "Emergencia", etiqueta: "Emergencias", icono: "warning" },
    { id: "Recurso", etiqueta: "Recursos", icono: "inventory_2" },
    { id: "Refugio", etiqueta: "Refugios", icono: "home" },
    { id: "Seguimiento", etiqueta: "Seguimiento", icono: "track_changes" },
    { id: "Otro", etiqueta: "Otros", icono: "category" }
  ];

  // Inyecta el servicio de alertas, el diálogo y el detector de cambios
  constructor(
    private alertaService: AlertaService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarAlertas();
  }

  // Llama al servicio para obtener los datos
  cargarAlertas(): void {
    this.loading = true;

    this.alertaService.getAll().subscribe({
      next: (data) => {
        console.log("Alertas cargadas:", data);
        this.alertas = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al cargar alertas:", error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Abre el modal para crear una nueva alerta
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(AlertaFormComponent, {
      width: "600px",
      data: { modo: "crear" }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarAlertas();
    });
  }

  // Abre el modal para editar una alerta existente
  abrirModalEditar(alerta: Alerta): void {
    const dialogRef = this.dialog.open(AlertaFormComponent, {
      width: "600px",
      data: { modo: "editar", alerta }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarAlertas();
    });
  }

  // Elimina una alerta tras confirmar con el usuario
  eliminarAlerta(id: number): void {
    if (confirm("¿Estás seguro de eliminar esta alerta?")) {
      this.alertaService.delete(id).subscribe({
        next: () => this.cargarAlertas(),
        error: (error) => console.error("Error al eliminar:", error)
      });
    }
  }

  // Establece el filtro activo
  setFiltro(filtroId: string): void {
    this.filtroActivo = filtroId === "todos"
      ? "todos"
      : filtroId.toUpperCase();
  }

  // Obtiene las alertas filtradas según el filtro activo y la búsqueda
  get alertasFiltradas(): Alerta[] {
    let resultado = this.alertas;

    // Aplica filtro por tipo
    if (this.filtroActivo !== "todos") {
      resultado = resultado.filter(a => a.tipo === this.filtroActivo);
    }

    // Aplica filtro por búsqueda
    if (this.busqueda) {
      const busquedaLower = this.busqueda.toLowerCase();

      resultado = resultado.filter(a =>
        a.tipo.toLowerCase().includes(busquedaLower) ||
        a.nivel.toLowerCase().includes(busquedaLower) ||
        a.mensaje.toLowerCase().includes(busquedaLower) ||
        a.estado.toLowerCase().includes(busquedaLower)
      );
    }

    return resultado;
  }

  // Obtiene el color del badge según el tipo de alerta
  getColorTipo(tipo: string): string {
    const colores: { [key: string]: string } = {
      Emergencia: "bg-red-100 text-red-700",
      Recurso: "bg-blue-100 text-blue-700",
      Refugio: "bg-emerald-100 text-emerald-700",
      Seguimiento: "bg-amber-100 text-amber-700",
      Otro: "bg-gray-100 text-gray-700"
    };

    return colores[tipo] || "bg-gray-100 text-gray-700";
  }

  // Obtiene el icono Material según el tipo de alerta
  getIconoTipo(tipo: string): string {
    const iconos: { [key: string]: string } = {
      Emergencia: "warning",
      Recurso: "inventory_2",
      Refugio: "home",
      Seguimiento: "track_changes",
      Otro: "category"
    };

    return iconos[tipo] || "notifications";
  }

  // Obtiene el color del badge según el nivel de la alerta
    getIconoNivel(nivel: string): string {
    switch (nivel) {
      case 'Informacion':
        return 'info';

      case 'Advertencia':
        return 'warning';

      case 'Critico':
        return 'error';

      default:
        return 'notifications';
    }
  }

  // Obtiene el color del badge según el estado de la alerta
  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      Activa: "bg-red-100 text-red-700",
      Leida: "bg-blue-100 text-blue-700",
      Resuelta: "bg-emerald-100 text-emerald-700"
    };

    return colores[estado] || "bg-gray-100 text-gray-700";
  }
}