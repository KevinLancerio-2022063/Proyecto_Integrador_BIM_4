import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { INCIDENTES_ROUTES } from "./incidentes.routes";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(INCIDENTES_ROUTES)
  ]
})
export class IncidenteModule {}