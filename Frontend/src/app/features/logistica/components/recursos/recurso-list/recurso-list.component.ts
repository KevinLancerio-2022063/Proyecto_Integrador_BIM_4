import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { RecursoService } from "../../../services/recurso.service";
import { Recurso } from "../../../models/recurso.model";

// Define el componente como independiente (standalone)
@Component({
  selector: "app-recurso-list",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: "./recurso-list.component.html",
  styleUrls: ["./recurso-list.component.css"]
})
export class RecursoListComponent implements OnInit {
  // Almacena la lista de recursos obtenidos del backend
  recursos: Recurso[] = [];
  
  // Define las columnas que se mostrarán en la tabla
  displayedColumns: string[] = ["nombre", "tipo", "cantidad_total", "unidad_medida", "acciones"];

  // Inyecta el servicio de recursos
  constructor(private recursoService: RecursoService) {}

  // Se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.loadRecursos();
  }

  // Llama al servicio para obtener los datos
  loadRecursos(): void {
    this.recursoService.getAll().subscribe({
      next: (data) => (this.recursos = data),
      error: (error) => console.error("Error al cargar recursos:", error)
    });
  }

  // Elimina un recurso tras confirmar con el usuario
  deleteRecurso(id: number): void {
    if (confirm("¿Estás seguro de eliminar este recurso?")) {
      this.recursoService.delete(id).subscribe({
        next: () => this.loadRecursos(),
        error: (error) => console.error("Error al eliminar:", error)
      });
    }
  }
}