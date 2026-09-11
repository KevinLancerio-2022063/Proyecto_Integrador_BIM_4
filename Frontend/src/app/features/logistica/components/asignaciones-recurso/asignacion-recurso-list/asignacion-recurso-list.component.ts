import { Component, OnInit } from "@angular/core";
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
    MatProgressSpinnerModule
  ],
  templateUrl: "./asignacion-recurso-list.component.html",
  styleUrls: ["./asignacion-recurso-list.component.css"]
})
export class AsignacionRecursoListComponent implements OnInit {
  // Almacena la lista de asignaciones obtenidas del backend
  asignaciones: AsignacionRecurso[] = [];
  
  // Almacena el término de búsqueda
  busqueda: string = "";
  
  // Indica si los datos están cargando
  loading: boolean = true;

  // Inyecta el servicio de asignaciones y el diálogo
  constructor(
    private asignacionService: AsignacionRecursoService,
    private dialog: MatDialog
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  // Llama al servicio para obtener los datos
  cargarAsignaciones(): void {
    this.loading = true;
    this.asignacionService.getAll().subscribe({
      next: (data) => {
        this.asignaciones = data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error al cargar asignaciones:", error);
        this.loading = false;
      }
    });
  }

  // Abre el modal para crear una nueva asignación
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(AsignacionRecursoFormComponent, {
      width: "700px",
      data: { modo: "crear" }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarAsignaciones();
    });
  }

  // Abre el modal para editar una asignación existente
  abrirModalEditar(asignacion: AsignacionRecurso): void {
    const dialogRef = this.dialog.open(AsignacionRecursoFormComponent, {
      width: "700px",
      data: { modo: "editar", asignacion }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarAsignaciones();
    });
  }

  // Elimina una asignación tras confirmar con el usuario
  eliminarAsignacion(id: number): void {
    if (confirm("¿Estás seguro de eliminar esta asignación?")) {
      this.asignacionService.delete(id).subscribe({
        next: () => this.cargarAsignaciones(),
        error: (error) => console.error("Error al eliminar:", error)
      });
    }
  }

  // Obtiene las asignaciones filtradas según la búsqueda
  get asignacionesFiltradas(): AsignacionRecurso[] {
    if (!this.busqueda) return this.asignaciones;
    
    const busquedaLower = this.busqueda.toLowerCase();
    return this.asignaciones.filter(a => 
      a.nombre_recurso?.toLowerCase().includes(busquedaLower) ||
      a.estado.toLowerCase().includes(busquedaLower)
    );
  }

  // Obtiene el color del badge según el estado de la asignación
  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      SOLICITADO: "bg-blue-100 text-blue-700",
      ASIGNADO: "bg-purple-100 text-purple-700",
      ENVIADO: "bg-amber-100 text-amber-700",
      ENTREGADO: "bg-emerald-100 text-emerald-700",
      CANCELADO: "bg-red-100 text-red-700"
    };
    return colores[estado] || "bg-gray-100 text-gray-700";
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
}