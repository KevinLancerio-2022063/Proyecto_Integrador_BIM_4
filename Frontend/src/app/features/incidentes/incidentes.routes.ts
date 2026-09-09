import { Routes } from "@angular/router";
import { IncidenteDetailComponent } from "./components/incidentes/incidente-detail/incidente-detail.component";
import { IncidenteFormComponent } from "./components/incidentes/incidente-form/incidente-form.component";
import { IncidenteListComponent } from "./components/incidentes/incidente-list/incidente-list.component";

// Define las rutas del módulo de logística
export const INCIDENTES_ROUTES: Routes = [
  // Redirige la ruta base de logística a la lista de recursos
  {
    path: "",
    redirectTo: "incidentes",
    pathMatch: "full"
  },
  // Ruta para listar todos los recursos
  {
    path: "incidentes",
    component: IncidenteListComponent
  },
  // Ruta para crear un nuevo recurso
  {
    path: "incidente/nuevo",
    component: IncidenteFormComponent
  },
  // Ruta para ver el detalle de un recurso específico
  {
    path: "incidentes/:id",
    component: IncidenteDetailComponent
  },
  // Ruta para editar un recurso existente
  {
    path: "incidentes/:id/editar",
    component: IncidenteFormComponent
  }
];