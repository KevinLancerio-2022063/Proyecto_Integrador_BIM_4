import { Routes } from "@angular/router";
import { IncidenteDetailComponent } from "./components/incidentes/incidente-detail/incidente-detail.component";
import { IncidenteFormComponent } from "./components/incidentes/incidente-form/incidente-form.component";
import { IncidenteListComponent } from "./components/incidentes/incidente-list/incidente-list.component";
import { HistorialListComponent } from "./components/historial/historial-list/historial-list.component";
import { HistorialDetailComponent } from "./components/historial/historial-detail/historial-detail.component";

// Define las rutas del módulo de incidentes
export const INCIDENTES_ROUTES: Routes = [
  // Ruta base - redirige a lista de incidentes
  {
    path: "",
    redirectTo: "incidentes",
    pathMatch: "full"
  },

  // ==============================
  // INCIDENTES
  // ==============================
  {
    path: "incidentes",
    component: IncidenteListComponent
  },
  {
    path: "incidente/nuevo",
    component: IncidenteFormComponent
  },
  {
    path: "incidentes/:id",
    component: IncidenteDetailComponent
  },
  {
    path: "incidentes/:id/editar",
    component: IncidenteFormComponent
  },

  // ==============================
  // HISTORIAL
  // ==============================
  {
    path: "historial",
    component: HistorialListComponent
  },
  {
    path: "historial/:id",
    component: HistorialDetailComponent
  }
];