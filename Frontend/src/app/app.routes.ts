import { Routes } from "@angular/router";
import { LayoutComponent } from "./features/incidentes/components/layout/layout.component";

// Definimos las rutas principales con layout
export const routes: Routes = [
  {
    path: "Incidentes",
    component: LayoutComponent,
    children: [
      {
        path: "incidentes",
        loadChildren: () => import("./features/incidentes/incidentes.module").then((m) => m.IncidenteModule)
      },
      {
        path: "",
        redirectTo: "incidentes",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/Incidentes/incidentes",
    pathMatch: "full"
  }
];