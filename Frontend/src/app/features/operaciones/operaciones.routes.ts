// Importa las rutas de Angular
import { Routes } from "@angular/router";

// Importa los componentes de Alertas
import { AlertaListComponent } from "./components/alertas/alerta-list/alerta-list.component";
import { AlertaFormComponent } from "./components/alertas/alerta-form/alerta-form.component";
import { AlertaDetailComponent } from "./components/alertas/alerta-detail/alerta-detail.component";
import { AlertaNotificationsComponent } from "./components/alertas/alerta-notifications/alerta-notifications.component";

// Importa los componentes de Asignación de Personal
import { AsignacionPersonalListComponent } from "./components/asignaciones-personal/asignacion-personal-list/asignacion-personal-list.component";
import { AsignacionPersonalFormComponent } from "./components/asignaciones-personal/asignacion-personal-form/asignacion-personal-form.component";

// Define las rutas del módulo de operaciones
export const OPERACIONES_ROUTES: Routes = [

  // ============================================
  // Rutas para Alertas
  // ============================================

  {
    path: "alertas",
    children: [
      { path: "", component: AlertaListComponent },
      { path: "nuevo", component: AlertaFormComponent },
      { path: "notificaciones", component: AlertaNotificationsComponent },
      { path: ":id", component: AlertaDetailComponent },
      { path: ":id/editar", component: AlertaFormComponent }
    ]
  },


  // ============================================
  // Rutas para Asignación de Personal
  // ============================================

  {
    path: "asignaciones-personal",
    children: [
      {
        path: "",
        component: AsignacionPersonalListComponent
      },
      {
        path: "nuevo",
        component: AsignacionPersonalFormComponent
      },
      {
        path: ":id/editar",
        component: AsignacionPersonalFormComponent
      }
    ]
  },


  // ============================================
  // Redirección por defecto a alertas
  // ============================================

  {
    path: "",
    redirectTo: "alertas",
    pathMatch: "full"
  }
];