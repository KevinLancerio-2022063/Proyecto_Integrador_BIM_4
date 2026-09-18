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

  // Inyecta el servicio de recursos, el diálogo y el detector de cambios
  constructor(
    private recursoService: RecursoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarRecursos();
  }

  // Llama al servicio para obtener los datos
  cargarRecursos(): void {
    this.loading = true;
    this.cdr.markForCheck(); // Marcar para verificación inmediata
    
    this.recursoService.getAll().subscribe({
      next: (data) => {
        console.log("Recursos cargados:", data);
        // Forzar una nueva referencia de array (spread operator)
        // Esto garantiza que Angular detecte que el objeto cambió
        this.recursos = [...data]; 
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Error al cargar recursos:", error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Abre el modal para crear un nuevo recurso
  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(RecursoFormComponent, {
      width: "600px",
      data: { modo: "crear" },
      panelClass: "modal-cyberpunk", 
      backdropClass: "backdrop-cyberpunk" 
    });
    
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        console.log("Recurso creado, recargando...");
        // 3. Pequeño delay para asegurar que el backend liberó la BD 
        // y el modal terminó su animación de cierre
        setTimeout(() => {
          this.cargarRecursos();
        }, 300);
      }
    });
  }

  // Abre el modal para editar un recurso existente
  abrirModalEditar(recurso: Recurso): void {
    const dialogRef = this.dialog.open(RecursoFormComponent, {
      width: "600px",
      data: { modo: "editar", recurso },
      panelClass: "modal-cyberpunk",
      backdropClass: "backdrop-cyberpunk" 
    });
    
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        console.log("Recurso editado, recargando...");
        setTimeout(() => {
          this.cargarRecursos();
        }, 300);
      }
    });
  }

  // Elimina un recurso tras confirmar con el usuario
  eliminarRecurso(id: number): void {
    if (confirm("¿Estás seguro de eliminar este recurso?")) {
      this.recursoService.delete(id).subscribe({
        next: () => {
          console.log("Recurso eliminado, recargando...");
          setTimeout(() => {
            this.cargarRecursos();
          }, 300);
        },
        error: (error) => {
          console.error("Error al eliminar:", error);
        }
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

// Mapeo de iconos por tipo de recurso
iconosPorTipo: { [key: string]: string } = {
  AGUA: "water_drop",
  ALIMENTO: "restaurant",
  MEDICAMENTO: "medical_services",
  EQUIPO: "build",
  VEHICULO: "local_shipping",
  OTRO: "category"
};

// Mapeo de colores por tipo de recurso
coloresPorTipo: { [key: string]: string } = {
  AGUA: "#1fa882",
  ALIMENTO: "#e68529",
  MEDICAMENTO: "#d94141",
  EQUIPO: "#2da160",
  VEHICULO: "#e69a2e",
  OTRO: "#6b7280"
};

// Mapeo de iconos por unidad de medida
iconosPorUnidad: { [key: string]: string } = {
  UNIDAD: "inventory_2",
  CAJA: "inventory",
  KILOGRAMO: "scale",
  LITRO: "water_drop",
  PERSONA: "person",
  OTRO: "category"
};

// Mapeo de colores por unidad de medida
coloresPorUnidad: { [key: string]: string } = {
  UNIDAD: "#00f0ff",
  CAJA: "#a0522d",
  KILOGRAMO: "#10b981",
  LITRO: "#0ea5e9",
  PERSONA: "#8338ec",
  OTRO: "#6b7280"
};

// Método para obtener el icono del tipo
getIconoTipo(tipo: string): string {
  return this.iconosPorTipo[tipo] || "category";
}

// Método para obtener el color del tipo
getColorTipo(tipo: string): string {
  return this.coloresPorTipo[tipo] || "#6b7280";
}

// Método para obtener el icono de la unidad
getIconoUnidad(unidad: string): string {
  return this.iconosPorUnidad[unidad] || "category";
}

// Método para obtener el color de la unidad
getColorUnidad(unidad: string): string {
  return this.coloresPorUnidad[unidad] || "#6b7280";
}
  
}