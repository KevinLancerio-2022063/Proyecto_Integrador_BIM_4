import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { AlertaService } from "../../../services/alerta.service";
import { Alerta } from "../../../models/alerta.model";

@Component({
  selector: "app-alerta-detail",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: "./alerta-detail.component.html",
  styleUrls: ["./alerta-detail.component.css"]
})
export class AlertaDetailComponent implements OnInit {
  // Almacena la alerta cargada
  alerta?: Alerta;

  // Almacena el ID extraído de la URL
  alertaId?: number;

  constructor(
    private route: ActivatedRoute,
    private alertaService: AlertaService
  ) {}

  // Obtiene el ID y carga los datos al iniciar
  ngOnInit(): void {
    this.alertaId = Number(this.route.snapshot.paramMap.get("id"));

    if (this.alertaId) {
      this.loadAlerta();
    }
  }

  // Llama al servicio para obtener el detalle
  loadAlerta(): void {
    if (this.alertaId) {
      this.alertaService.getById(this.alertaId).subscribe({
        next: (data) => (this.alerta = data),
        error: (error) =>
          console.error("Error al cargar el detalle de la alerta:", error)
      });
    }
  }
}