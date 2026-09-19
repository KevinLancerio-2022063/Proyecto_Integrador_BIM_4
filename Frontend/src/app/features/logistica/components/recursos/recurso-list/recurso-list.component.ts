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
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";

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
    FechaFormateadaPipe,
    ConfirmDialogComponent
  ],
  templateUrl: "./recurso-list.component.html",
  styleUrls: ["./recurso-list.component.css"]
})
export class RecursoListComponent implements OnInit {
  recursos: Recurso[] = [];
  filtroActivo: string = "todos";
  busqueda: string = "";
  loading: boolean = true;
  
  mostrarDialogoEliminacion: boolean = false;
  recursoSeleccionadoParaEliminar: Recurso | null = null;

  filtros = [
    { id: "todos", etiqueta: "Todos", icono: "inventory_2" },
    { id: "AGUA", etiqueta: "Agua", icono: "water_drop" },
    { id: "ALIMENTO", etiqueta: "Alimentos", icono: "restaurant" },
    { id: "MEDICAMENTO", etiqueta: "Medicamentos", icono: "medical_services" },
    { id: "EQUIPO", etiqueta: "Equipos", icono: "construction" },
    { id: "VEHICULO", etiqueta: "Vehículos", icono: "local_shipping" },
    { id: "OTRO", etiqueta: "Otros", icono: "category" }
  ];

  iconosPorTipo: { [key: string]: string } = {
    AGUA: "water_drop",
    ALIMENTO: "restaurant",
    MEDICAMENTO: "medical_services",
    EQUIPO: "build",
    VEHICULO: "local_shipping",
    OTRO: "category"
  };

  coloresPorTipo: { [key: string]: string } = {
    AGUA: "#1fa882",
    ALIMENTO: "#e68529",
    MEDICAMENTO: "#d94141",
    EQUIPO: "#2da160",
    VEHICULO: "#e69a2e",
    OTRO: "#6b7280"
  };

  iconosPorUnidad: { [key: string]: string } = {
    UNIDAD: "inventory_2",
    CAJA: "inventory",
    KILOGRAMO: "scale",
    LITRO: "water_drop",
    PERSONA: "person",
    OTRO: "category"
  };

  coloresPorUnidad: { [key: string]: string } = {
    UNIDAD: "#00f0ff",
    CAJA: "#a0522d",
    KILOGRAMO: "#10b981",
    LITRO: "#0ea5e9",
    PERSONA: "#8338ec",
    OTRO: "#6b7280"
  };

  constructor(
    private recursoService: RecursoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarRecursos();
  }

  cargarRecursos(): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.recursoService.getAll().subscribe({
      next: (data) => {
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

  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(RecursoFormComponent, {
      width: "600px",
      data: { modo: "crear" },
      panelClass: "modal-cyberpunk", 
      backdropClass: "backdrop-cyberpunk" 
    });
    
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        setTimeout(() => {
          this.cargarRecursos();
        }, 300);
      }
    });
  }

  abrirModalEditar(recurso: Recurso): void {
    const dialogRef = this.dialog.open(RecursoFormComponent, {
      width: "600px",
      data: { modo: "editar", recurso },
      panelClass: "modal-cyberpunk",
      backdropClass: "backdrop-cyberpunk" 
    });
    
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        setTimeout(() => {
          this.cargarRecursos();
        }, 300);
      }
    });
  }

  prepararEliminacion(recurso: Recurso): void {
    this.recursoSeleccionadoParaEliminar = recurso;
    this.mostrarDialogoEliminacion = true;
  }

  cerrarDialogoEliminacion(): void {
    this.mostrarDialogoEliminacion = false;
    this.recursoSeleccionadoParaEliminar = null;
  }

  confirmarEliminacion(): void {
    if (!this.recursoSeleccionadoParaEliminar?.id) return;

    this.recursoService.delete(this.recursoSeleccionadoParaEliminar.id).subscribe({
      next: () => {
        this.cerrarDialogoEliminacion();
        setTimeout(() => {
          this.cargarRecursos();
        }, 300);
      },
      error: (error) => {
        console.error("Error al eliminar:", error);
        this.cerrarDialogoEliminacion();
      }
    });
  }

  setFiltro(filtroId: string): void {
    this.filtroActivo = filtroId;
  }

  get recursosFiltrados(): Recurso[] {
    let resultado = this.recursos;
    
    if (this.filtroActivo !== "todos") {
      resultado = resultado.filter(r => r.tipo === this.filtroActivo);
    }
    
    if (this.busqueda) {
      const busquedaLower = this.busqueda.toLowerCase();
      resultado = resultado.filter(r => 
        r.nombre.toLowerCase().includes(busquedaLower) ||
        r.descripcion?.toLowerCase().includes(busquedaLower)
      );
    }
    
    return resultado;
  }

  getIconoTipo(tipo: string): string {
    return this.iconosPorTipo[tipo] || "category";
  }

  getColorTipo(tipo: string): string {
    return this.coloresPorTipo[tipo] || "#6b7280";
  }

  getIconoUnidad(unidad: string): string {
    return this.iconosPorUnidad[unidad] || "category";
  }

  getColorUnidad(unidad: string): string {
    return this.coloresPorUnidad[unidad] || "#6b7280";
  }
}