// Importa las rutas de Angular
import { Routes } from "@angular/router";

// Importa los componentes de Recursos
import { RecursoListComponent } from "./components/recursos/recurso-list/recurso-list.component";
import { RecursoFormComponent } from "./components/recursos/recurso-form/recurso-form.component";
import { RecursoDetailComponent } from "./components/recursos/recurso-detail/recurso-detail.component";

// Importa los componentes de Refugios
import { RefugioListComponent } from "./components/refugios/refugio-list/refugio-list.component";
import { RefugioFormComponent } from "./components/refugios/refugio-form/refugio-form.component";

// Importa los componentes de Asignaciones
import { AsignacionRecursoListComponent } from "./components/asignaciones-recurso/asignacion-recurso-list/asignacion-recurso-list.component";
import { AsignacionRecursoFormComponent } from "./components/asignaciones-recurso/asignacion-recurso-form/asignacion-recurso-form.component";

// Define las rutas del módulo de logística
export const LOGISTICA_ROUTES: Routes = [
  // Rutas para Recursos
  {
    path: "recursos",
    children: [
      { path: "", component: RecursoListComponent },
      { path: "nuevo", component: RecursoFormComponent },
      { path: ":id", component: RecursoDetailComponent },
      { path: ":id/editar", component: RecursoFormComponent }
    ]
  },
  // Rutas para Refugios
  {
    path: "refugios",
    children: [
      { path: "", component: RefugioListComponent },
      { path: "nuevo", component: RefugioFormComponent },
      { path: ":id/editar", component: RefugioFormComponent }
    ]
  },
  // Rutas para Asignaciones
  {
    path: "asignaciones",
    children: [
      { path: "", component: AsignacionRecursoListComponent },
      { path: "nuevo", component: AsignacionRecursoFormComponent },
      { path: ":id/editar", component: AsignacionRecursoFormComponent }
    ]
  },
  // Redirección por defecto a recursos
  {
    path: "",
    redirectTo: "recursos",
    pathMatch: "full"
  }
];