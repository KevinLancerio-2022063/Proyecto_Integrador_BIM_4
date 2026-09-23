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

import { RefugioService } from "../../../services/refugio.service";
import { Refugio } from "../../../models/refugio.model";
import { RefugioFormComponent } from "../refugio-form/refugio-form.component";
import { ConfirmDialogComponent } from "../../confirm-dialog/confirm-dialog.component";

import { EstadoRefugioPipe } from "../../../pipes/estado-refugio.pipe";
import { PorcentajeOcupacionPipe } from "../../../pipes/porcentaje-ocupacion.pipe";
import { FechaFormateadaPipe } from "../../../pipes/fecha-formateada.pipe";

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
    MatProgressSpinnerModule,
    ConfirmDialogComponent,
    EstadoRefugioPipe,
    PorcentajeOcupacionPipe,
    FechaFormateadaPipe
  ],
  templateUrl: "./refugio-list.component.html",
  styleUrls: ["./refugio-list.component.css"]
})
export class RefugioListComponent implements OnInit {
  refugios: Refugio[] = [];
  filtroActivo: string = "todos";
  busqueda: string = "";
  loading: boolean = true;

  mostrarDialogoEliminacion: boolean = false;
  refugioSeleccionadoParaEliminar: Refugio | null = null;

  filtros = [
    { id: "todos", etiqueta: "Todos", icono: "home" },
    { id: "disponible", etiqueta: "Disponibles", icono: "check_circle" },
    { id: "parcial", etiqueta: "Parcial", icono: "remove_circle" },
    { id: "lleno", etiqueta: "Lleno", icono: "cancel" },
    { id: "inactivo", etiqueta: "Inactivo", icono: "block" }
  ];

  constructor(
    private refugioService: RefugioService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarRefugios();
  }

  cargarRefugios(): void {
    this.loading = true;
    this.cdr.markForCheck();
    
    this.refugioService.getAll().subscribe({
      next: (data) => {
        // Forzamos una nueva referencia de array para que Angular detecte el cambio
        this.refugios = [...data];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("Error al cargar refugios:", error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  abrirModalCrear(): void {
    const dialogRef = this.dialog.open(RefugioFormComponent, {
      width: "700px",
      data: { modo: "crear" },
      panelClass: "modal-cyberpunk",
      backdropClass: "backdrop-cyberpunk"
    });
    
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        // Activamos el loading inmediatamente para dar feedback visual
        this.loading = true;
        this.cdr.markForCheck();
        
        // Aumentamos el delay a 600ms para asegurar que el backend procesó la escritura
        setTimeout(() => {
          this.cargarRefugios();
        }, 600);
      }
    });
  }

  abrirModalEditar(refugio: Refugio): void {
    const dialogRef = this.dialog.open(RefugioFormComponent, {
      width: "700px",
      data: { modo: "editar", refugio },
      panelClass: "modal-cyberpunk",
      backdropClass: "backdrop-cyberpunk"
    });
    
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.loading = true;
        this.cdr.markForCheck();
        
        setTimeout(() => {
          this.cargarRefugios();
        }, 600);
      }
    });
  }

  prepararEliminacion(refugio: Refugio): void {
    this.refugioSeleccionadoParaEliminar = refugio;
    this.mostrarDialogoEliminacion = true;
  }

  cerrarDialogoEliminacion(): void {
    this.mostrarDialogoEliminacion = false;
    this.refugioSeleccionadoParaEliminar = null;
  }

  confirmarEliminacion(): void {
    if (!this.refugioSeleccionadoParaEliminar?.id) return;

    this.loading = true; // Feedback visual durante la eliminación
    this.cdr.markForCheck();

    this.refugioService.delete(this.refugioSeleccionadoParaEliminar.id).subscribe({
      next: () => {
        this.cerrarDialogoEliminacion();
        setTimeout(() => {
          this.cargarRefugios();
        }, 600);
      },
      error: (error) => {
        console.error("Error al eliminar:", error);
        this.loading = false;
        this.cerrarDialogoEliminacion();
        this.cdr.markForCheck();
      }
    });
  }

  setFiltro(filtroId: string): void {
    this.filtroActivo = filtroId;
  }

  get refugiosFiltrados(): Refugio[] {
    let resultado = this.refugios;
    
    if (this.filtroActivo !== "todos") {
      resultado = resultado.filter(r => r.estado.toLowerCase() === this.filtroActivo);
    }
    
    if (this.busqueda) {
      const busquedaLower = this.busqueda.toLowerCase();
      resultado = resultado.filter(r => 
        r.nombre.toLowerCase().includes(busquedaLower) ||
        r.direccion?.toLowerCase().includes(busquedaLower)
      );
    }
    
    return resultado;
  }

  getEstadoIcono(estado: string): string {
    const iconos: { [key: string]: string } = {
      DISPONIBLE: "check_circle",
      PARCIAL: "remove_circle",
      LLENO: "cancel",
      INACTIVO: "block"
    };
    return iconos[estado] || "help";
  }

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      DISPONIBLE: "#10b981",
      PARCIAL: "#f59e0b",
      LLENO: "#ef4444",
      INACTIVO: "#6b7280"
    };
    return colores[estado] || "#6b7280";
  }

  getColorProgreso(porcentaje: number): string {
    if (porcentaje >= 90) return "#ef4444";
    if (porcentaje >= 70) return "#f59e0b";
    return "#10b981";
  }
}