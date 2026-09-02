import { Routes } from "@angular/router";

export const routes: Routes = [
  // Carga diferida del módulo de logística cuando el usuario entra a /logistica
  {
    path: "logistica",
    loadChildren: () => import("./features/logistica/logistica.module").then((m) => m.LogisticaModule)
  },
  // Redirección por defecto a la lista de recursos
  {
    path: "",
    redirectTo: "/logistica/recursos",
    pathMatch: "full"
  }
];