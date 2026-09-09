import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { IncidenteService } from "../../../services/incidente.service";
import { Incidente } from "../../../models/incidente.model";

@Component({
  selector: "app-incidente-detail",
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatProgressSpinnerModule, 
    RouterLink
  ],
  templateUrl: "./incidente-detail.component.html",
  styleUrls: ["./incidente-detail.component.css"]
})
export class IncidenteDetailComponent implements OnInit {
  // Acepta explícitamente 'null' para coincidir con la respuesta del servicio
  incidente: Incidente | null = null;
  
  // Almacena el ID extraído de la URL
  incidenteId?: number;

  // Estado de carga para la UI
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private incidenteService: IncidenteService
  ) {}

  // Obtiene el ID y carga los datos al iniciar
  ngOnInit(): void {
    this.incidenteId = Number(this.route.snapshot.paramMap.get("id"));
    if (this.incidenteId) {
      this.loadIncidente();
    } else {
      this.loading = false;
    }
  }

  // Llama al servicio para obtener el detalle
  loadIncidente(): void {
    if (this.incidenteId) {
      this.loading = true;
      this.incidenteService.getById(this.incidenteId).subscribe({
        next: (data) => {
          this.incidente = data;
          this.loading = false;
        },
        error: (error) => {
          console.error("Error al cargar el detalle:", error);
          this.loading = false;
        }
      });
    }
  }
}