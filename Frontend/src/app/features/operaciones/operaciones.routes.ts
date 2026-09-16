// Importa las rutas de Angular
import { Routes } from "@angular/router";

// Importa los componentes de Alertas
import { AlertaListComponent } from "./components/alertas/alerta-list/alerta-list.component";
import { AlertaFormComponent } from "./components/alertas/alerta-form/alerta-form.component";
import { AlertaDetailComponent } from "./components/alertas/alerta-detail/alerta-detail.component";

// Define las rutas del módulo de operaciones
export const OPERACIONES_ROUTES: Routes = [

  // Rutas para Alertas
  {
    path: "alertas",
    children: [
      { path: "", component: AlertaListComponent },
      { path: "nuevo", component: AlertaFormComponent },
      { path: ":id", component: AlertaDetailComponent },
      { path: ":id/editar", component: AlertaFormComponent }
    ]
  },

  // Redirección por defecto a alertas
  {
    path: "",
    redirectTo: "alertas",
    pathMatch: "full"
  }
];