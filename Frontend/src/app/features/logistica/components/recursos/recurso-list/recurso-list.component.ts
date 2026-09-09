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
import { RecursoService } from "../../../services/recurso.service";
import { Recurso } from "../../../models/recurso.model";
import { RecursoFormComponent } from "../recurso-form/recurso-form.component";
import { TipoRecursoPipe } from "../../../pipes/tipo-recurso.pipe";
import { UnidadMedidaPipe } from "../../../pipes/unidad-medida.pipe";
import { FechaFormateadaPipe } from "../../../pipes/fecha-formateada.pipe";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-recurso-list",
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
    TipoRecursoPipe,
    UnidadMedidaPipe,
    FechaFormateadaPipe
  ],
  templateUrl: "./recurso-list.component.html",
  styleUrls: ["./recurso-list.component.css"]
})

export class RecursoListComponent implements OnInit {
  // Almacena la lista de recursos obtenidos del backend
  recursos: Recurso[] = [];
  
  // Almacena el filtro activo seleccionado
  filtroActivo: string = "todos";
  
  // Almacena el término de búsqueda
  busqueda: string = "";
  
  // Indica si los datos están cargando
  loading: boolean = true;
  
  // Define los filtros disponibles para recursos con sus iconos
  filtros = [
    { id: "todos", etiqueta: "Todos", icono: "inventory_2" },
    { id: "AGUA", etiqueta: "Agua", icono: "water_drop" },
    { id: "ALIMENTO", etiqueta: "Alimentos", icono: "restaurant" },
    { id: "MEDICAMENTO", etiqueta: "Medicamentos", icono: "medical_services" },
    { id: "EQUIPO", etiqueta: "Equipos", icono: "construction" },
    { id: "VEHICULO", etiqueta: "Vehículos", icono: "local_shipping" },
    { id: "OTRO", etiqueta: "Otros", icono: "category" }
  ];

  // Inyecta el servicio de recursos y el diálogo
  constructor(
    private recursoService: RecursoService,
    private dialog: MatDialog
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarRecursos();
  }

  // Llama al servicio para obtener los datos
  cargarRecursos(): void {
    this.loading = true;
    this.recursoService.getAll().subscribe({
      next: (data) => {
        this.recursos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error("Error al cargar recursos:", error);
        this.loading = false;
      }
    });
  }

  // Abre el modal para crear un nuevo recurso
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(RecursoFormComponent, {
      width: "600px",
      data: { modo: "crear" }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarRecursos();
    });
  }

  // Abre el modal para editar un recurso existente
  abrirModalEditar(recurso: Recurso): void {
    const dialogRef = this.dialog.open(RecursoFormComponent, {
      width: "600px",
      data: { modo: "editar", recurso }
    });
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) this.cargarRecursos();
    });
  }

  // Elimina un recurso tras confirmar con el usuario
  eliminarRecurso(id: number): void {
    if (confirm("¿Estás seguro de eliminar este recurso?")) {
      this.recursoService.delete(id).subscribe({
        next: () => this.cargarRecursos(),
        error: (error) => console.error("Error al eliminar:", error)
      });
    }
  }

  // Establece el filtro activo
  setFiltro(filtroId: string): void {
    this.filtroActivo = filtroId;
  }

  // Obtiene los recursos filtrados según el filtro activo y la búsqueda
  get recursosFiltrados(): Recurso[] {
    let resultado = this.recursos;
    
    // Aplica filtro por tipo
    if (this.filtroActivo !== "todos") {
      resultado = resultado.filter(r => r.tipo === this.filtroActivo);
    }
    
    // Aplica filtro por búsqueda
    if (this.busqueda) {
      const busquedaLower = this.busqueda.toLowerCase();
      resultado = resultado.filter(r => 
        r.nombre.toLowerCase().includes(busquedaLower) ||
        r.descripcion?.toLowerCase().includes(busquedaLower)
      );
    }
    
    return resultado;
  }

  // Obtiene el color del badge según el tipo de recurso
  getColorTipo(tipo: string): string {
    const colores: { [key: string]: string } = {
      AGUA: "bg-sky-100 text-sky-700",
      ALIMENTO: "bg-emerald-100 text-emerald-700",
      MEDICAMENTO: "bg-red-100 text-red-700",
      EQUIPO: "bg-amber-100 text-amber-700",
      VEHICULO: "bg-purple-100 text-purple-700",
      OTRO: "bg-gray-100 text-gray-700"
    };
    return colores[tipo] || "bg-gray-100 text-gray-700";
  }

  // Obtiene el icono Material según el tipo de recurso
  getIconoTipo(tipo: string): string {
    const iconos: { [key: string]: string } = {
      AGUA: "water_drop",
      ALIMENTO: "restaurant",
      MEDICAMENTO: "medical_services",
      EQUIPO: "construction",
      VEHICULO: "local_shipping",
      OTRO: "category"
    };
    return iconos[tipo] || "inventory_2";
  }
}