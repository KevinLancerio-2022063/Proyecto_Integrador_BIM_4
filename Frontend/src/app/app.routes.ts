import { Routes } from "@angular/router";
import { LayoutComponent } from "./features/logistica/components/layout/layout.component";
import { coreRoutes } from "./features/core/core.routes";

// Filtramos las rutas de core para quitar login y register
const protectedCoreRoutes = coreRoutes.filter(
  (route) => route.path !== "login" && route.path !== "register"
);

export const routes: Routes = [
  // ==========================================
  // 1. RUTAS PÚBLICAS (Sin Layout)
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
    children: [
      // Redirección por defecto al entrar al sistema
      {
        path: "",
        redirectTo: "logistica",
        pathMatch: "full"
      },
      
      // Módulo de Logística
      {
        path: "logistica",
        loadChildren: () =>
          import("./features/logistica/logistica.module").then(
            (m) => m.LogisticaModule
          )
      },
      
      // Módulo de Incidentes (Incluye Historial)
      {
        path: "incidentes",
        loadChildren: () =>
          import("./features/incidentes/incidentes.module").then(
            (m) => m.IncidenteModule
          )
      },
      
      // Módulo de Operaciones (Incluye Alertas y Asignaciones)
      {
        path: "operaciones",
        loadChildren: () =>
          import("./features/operaciones/operaciones.module").then(
            (m) => m.OperacionesModule
          )
      },
      
      // Rutas de Core (Usuarios, Zonas, Perfil)
      ...protectedCoreRoutes,
      
      // Wildcard local: Si la ruta no existe dentro del layout, redirige a logistica
      {
        path: "**",
        redirectTo: "logistica"
      }
    ]
  },

  // ==========================================
  // 3. REDIRECCIÓN GLOBAL (Si la ruta no existe)
  // ==========================================
  {
    path: "**",
    redirectTo: "/login"
  }
];