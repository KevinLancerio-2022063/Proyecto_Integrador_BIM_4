import { Routes } from "@angular/router";
import { LayoutComponent } from "./features/logistica/components/layout/layout.component";

// Define las rutas principales de la aplicación
export const routes: Routes = [
  {
    path: "logistica",
    component: LayoutComponent,
    children: [
      {
        // Carga el módulo de logística en la ruta base de logistica
        path: "",
        loadChildren: () => import("./features/logistica/logistica.module").then((m) => m.LogisticaModule)
      }
    ]
  },
  {
    // Redirección global a la sección de logística
    path: "",
    redirectTo: "/logistica",
    pathMatch: "full"
  }
];