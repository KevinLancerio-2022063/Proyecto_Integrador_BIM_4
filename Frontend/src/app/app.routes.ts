// src/app/app.routes.ts
import { Routes } from "@angular/router";
import { LayoutComponent } from "./features/logistica/components/layout/layout.component";
import { coreRoutes } from "./features/core/core.routes";
import { authGuard } from "../app/features/core/guards/auth.guard";

// Filtramos las rutas de core para quitar login y register (son públicas)
const protectedCoreRoutes = coreRoutes.filter(
  (route) => route.path !== "login" && route.path !== "register"
);

export const routes: Routes = [
  // ==========================================
  // 1. RUTAS PÚBLICAS (Sin Layout, sin guards)
  // ==========================================
  {
    path: "login",
    loadComponent: () =>
      import("./features/core/components/auth/login/login.component").then(
        (m) => m.LoginComponent
      )
  },
  {
    path: "register",
    loadComponent: () =>
      import("./features/core/components/auth/register/register.component").then(
        (m) => m.RegisterComponent
      )
  },

  // ==========================================
  // 2. RUTAS PROTEGIDAS (Con Layout Principal)
  // ==========================================
  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard], // CAPA 1: Requiere estar autenticado para entrar al layout
    children: [
      {
        path: "",
        redirectTo: "logistica",
        pathMatch: "full"
      },
      {
        path: "logistica",
        loadChildren: () =>
          import("./features/logistica/logistica.module").then(
            (m) => m.LogisticaModule
          )
      },
      {
        path: "incidentes",
        loadChildren: () =>
          import("./features/incidentes/incidentes.module").then(
            (m) => m.IncidenteModule
          )
      },
      {
        path: "operaciones",
        loadChildren: () =>
          import("./features/operaciones/operaciones.module").then(
            (m) => m.OperacionesModule
          )
      },
      
      // CAPA 2: Las rutas de core se evalúan aquí con sus propios guards
      ...protectedCoreRoutes,
      
      {
        path: "**",
        redirectTo: "logistica"
      }
    ]
  },

  // ==========================================
  // 3. REDIRECCIÓN GLOBAL
  // ==========================================
  {
    path: "**",
    redirectTo: "/login"
  }
];