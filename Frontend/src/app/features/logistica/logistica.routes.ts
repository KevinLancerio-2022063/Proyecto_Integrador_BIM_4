import { Routes } from "@angular/router";
import { RecursoListComponent } from "./components/recursos/recurso-list/recurso-list.component";
import { RecursoDetailComponent } from "./components/recursos/recurso-detail/recurso-detail.component";
import { RecursoFormComponent } from "./components/recursos/recurso-form/recurso-form.component";

// Define las rutas del módulo de logística
export const LOGISTICA_ROUTES: Routes = [
  // Redirige la ruta base de logística a la lista de recursos
  {
    path: "",
    redirectTo: "recursos",
    pathMatch: "full"
  },
  // Ruta para listar todos los recursos
  {
    path: "recursos",
    component: RecursoListComponent
  },
  // Ruta para crear un nuevo recurso
  {
    path: "recursos/nuevo",
    component: RecursoFormComponent
  },
  // Ruta para ver el detalle de un recurso específico
  {
    path: "recursos/:id",
    component: RecursoDetailComponent
  },
  // Ruta para editar un recurso existente
  {
    path: "recursos/:id/editar",
    component: RecursoFormComponent
  }
];