import { Routes } from "@angular/router";
import { LayoutComponent } from "./features/logistica/components/layout/layout.component";

// Definimos las rutas principales con layout
export const routes: Routes = [
  {
    path: "logistica",
    component: LayoutComponent,
    children: [
      {
        path: "recursos",
        loadChildren: () => import("./features/logistica/logistica.module").then(m => m.LogisticaModule)
      },
      {
        path: "",
        redirectTo: "recursos",
        pathMatch: "full"
      }
    ]
  },
  {
    path: "",
    redirectTo: "/logistica/recursos",
    pathMatch: "full"
  }
];