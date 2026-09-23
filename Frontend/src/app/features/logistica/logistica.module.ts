import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LOGISTICA_ROUTES } from "./logistica.routes";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LOGISTICA_ROUTES)
  ]
})
export class LogisticaModule {}