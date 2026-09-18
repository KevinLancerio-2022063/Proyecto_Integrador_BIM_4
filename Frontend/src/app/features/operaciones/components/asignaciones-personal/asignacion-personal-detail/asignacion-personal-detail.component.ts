import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { AsignacionPersonalService } from "../../../services/asignacion-personal.service";
import { AsignacionPersonal } from "../../../models/asignacion-personal.model";

@Component({
  selector: "app-asignacion-personal-detail",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: "./asignacion-personal-detail.component.html",
  styleUrls: ["./asignacion-personal-detail.component.css"]
})
export class AsignacionPersonalDetailComponent implements OnInit {
  // Almacena la asignación de personal cargada
  asignacionPersonal?: AsignacionPersonal;

  // Almacena el ID extraído de la URL
  asignacionPersonalId?: number;

  constructor(
    private route: ActivatedRoute,
    private asignacionPersonalService: AsignacionPersonalService
  ) {}

  // Obtiene el ID y carga los datos al iniciar
  ngOnInit(): void {
    this.asignacionPersonalId = Number(
      this.route.snapshot.paramMap.get("id")
    );

    if (this.asignacionPersonalId) {
      this.loadAsignacionPersonal();
    }
  }

  // Llama al servicio para obtener el detalle
  loadAsignacionPersonal(): void {
    if (this.asignacionPersonalId) {
      this.asignacionPersonalService
        .getById(this.asignacionPersonalId)
        .subscribe({
          next: (data) => (this.asignacionPersonal = data),
          error: (error) =>
            console.error(
              "Error al cargar el detalle de la asignación de personal:",
              error
            )
        });
    }
  }
}
