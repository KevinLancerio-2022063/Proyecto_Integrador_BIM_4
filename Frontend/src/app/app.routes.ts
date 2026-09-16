import { Routes } from "@angular/router";
import { LayoutComponent } from "./features/operaciones/components/layout/layout.component";

// Define las rutas principales de la aplicación
export const routes: Routes = [
  {
    path: "operaciones",
    component: LayoutComponent,
    children: [
      {
        // Carga el módulo de operaciones en la ruta base de operaciones
        path: "",
        loadChildren: () =>
          import("./features/operaciones/operaciones.module").then(
            (m) => m.OperacionesModule
          )
      }
    ]
  },
  {
    // Redirección global a la sección de operaciones
    path: "",
    redirectTo: "/operaciones",
    pathMatch: "full"
  }
];