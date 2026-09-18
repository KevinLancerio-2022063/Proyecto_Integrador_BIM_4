import { Routes } from "@angular/router";

import { IncidenteDetailComponent } from "./components/incidentes/incidente-detail/incidente-detail.component";
import { IncidenteFormComponent } from "./components/incidentes/incidente-form/incidente-form.component";
import { IncidenteListComponent } from "./components/incidentes/incidente-list/incidente-list.component";

import { HistorialListComponent } from "./components/historial/historial-list/historial-list.component";
import { HistorialDetailComponent } from "./components/historial/historial-detail/historial-detail.component";


// Define las rutas del módulo de incidentes
export const INCIDENTES_ROUTES: Routes = [

  // Ruta base
  {
    path: "",
    redirectTo: "incidentes",
    pathMatch: "full"
  },

  // ==============================
  // INCIDENTES
  // ==============================

  // Lista de incidentes
  {
    path: "incidentes",
    component: IncidenteListComponent
  },

  // Crear incidente
  {
    path: "incidente/nuevo",
    component: IncidenteFormComponent
  },

  // Detalle de incidente
  {
    path: "incidentes/:id",
    component: IncidenteDetailComponent
  },

  // Editar incidente
  {
    path: "incidentes/:id/editar",
    component: IncidenteFormComponent
  },


  // ==============================
  // HISTORIAL
  // ==============================

  // Lista del historial
  {
    path: "historial",
    component: HistorialListComponent
  },

  // Detalle de un registro del historial
  {
    path: "historial/:id",
    component: HistorialDetailComponent
  }

];