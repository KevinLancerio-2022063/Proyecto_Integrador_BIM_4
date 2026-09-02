import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { RecursoService } from "../../../services/recurso.service";
import { Recurso } from "../../../models/recurso.model";

@Component({
  selector: "app-recurso-detail",
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: "./recurso-detail.component.html",
  styleUrls: ["./recurso-detail.component.css"]
})
export class RecursoDetailComponent implements OnInit {
  // Almacena el recurso cargado
  recurso?: Recurso;
  
  // Almacena el ID extraído de la URL
  recursoId?: number;

  constructor(
    private route: ActivatedRoute,
    private recursoService: RecursoService
  ) {}

  // Obtiene el ID y carga los datos al iniciar
  ngOnInit(): void {
    this.recursoId = Number(this.route.snapshot.paramMap.get("id"));
    if (this.recursoId) {
      this.loadRecurso();
    }
  }

  // Llama al servicio para obtener el detalle
  loadRecurso(): void {
    if (this.recursoId) {
      this.recursoService.getById(this.recursoId).subscribe({
        next: (data) => (this.recurso = data),
        error: (error) => console.error("Error al cargar el detalle:", error)
      });
    }
  }
}