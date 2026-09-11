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
import { RefugioService } from "../../../services/refugio.service";
import { Refugio } from "../../../models/refugio.model";
import { RefugioFormComponent } from "../refugio-form/refugio-form.component";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-refugio-list",
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
  templateUrl: "./refugio-list.component.html",
  styleUrls: ["./refugio-list.component.css"]
})
export class RefugioListComponent implements OnInit {
  // Almacena la lista de refugios obtenidos del backend
  refugios: Refugio[] = [];
  
  // Almacena el término de búsqueda
  busqueda: string = "";
  
  // Indica si los datos están cargando
  loading: boolean = true;

  // Inyecta el servicio de refugios y el diálogo
  constructor(
    private refugioService: RefugioService,
    private dialog: MatDialog
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarRefugios();
  }

  // Llama al servicio para obtener los datos
  cargarRefugios(): void {
    this.loading = true;
    this.refugioService.getAll().subscribe({
      next: (data) => {
        this.refugios = data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error al cargar refugios:", error);
        this.loading = false;
      }
    });
  }

  // Abre el modal para crear un nuevo refugio
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(RefugioFormComponent, {
      width: "700px",
      data: { modo: "crear" }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarRefugios();
    });
  }

  // Abre el modal para editar un refugio existente
  abrirModalEditar(refugio: Refugio): void {
    const dialogRef = this.dialog.open(RefugioFormComponent, {
      width: "700px",
      data: { modo: "editar", refugio }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarRefugios();
    });
  }

  // Elimina un refugio tras confirmar con el usuario
  eliminarRefugio(id: number): void {
    if (confirm("¿Estás seguro de eliminar este refugio?")) {
      this.refugioService.delete(id).subscribe({
        next: () => this.cargarRefugios(),
        error: (error) => console.error("Error al eliminar:", error)
      });
    }
  }

  // Obtiene los refugios filtrados según la búsqueda
  get refugiosFiltrados(): Refugio[] {
    if (!this.busqueda) return this.refugios;
    
    const busquedaLower = this.busqueda.toLowerCase();
    return this.refugios.filter(r => 
      r.nombre.toLowerCase().includes(busquedaLower) ||
      r.direccion?.toLowerCase().includes(busquedaLower)
    );
  }

  // Obtiene el color del badge según el estado del refugio
  getColorEstado(estado: string): string {
    const colores: { [key: string]: string } = {
      DISPONIBLE: "bg-emerald-100 text-emerald-700",
      PARCIAL: "bg-amber-100 text-amber-700",
      LLENO: "bg-red-100 text-red-700",
      INACTIVO: "bg-gray-100 text-gray-700"
    };
    return colores[estado] || "bg-gray-100 text-gray-700";
  }

  // Calcula el porcentaje de ocupación
  getPorcentajeOcupacion(ocupacion: number, capacidad: number): number {
    if (!capacidad || capacidad === 0) return 0;
    return Math.min(Math.round((ocupacion / capacidad) * 100), 100);
  }
}