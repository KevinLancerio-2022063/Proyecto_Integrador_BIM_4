import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { OPERACIONES_ROUTES } from "./operaciones.routes";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OPERACIONES_ROUTES)
  ]
})
export class OperacionesModule {}