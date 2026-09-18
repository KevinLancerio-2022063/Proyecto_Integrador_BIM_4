import { Routes } from "@angular/router";
import { LayoutComponent } from "./features/logistica/components/layout/layout.component";
import { coreRoutes } from './features/core/core.routes';

// 1. Filtramos las rutas de core para quitar login y register.
// Esto evita que queden anidadas dentro del Layout (sidebar/header).
const protectedCoreRoutes = coreRoutes.filter(
  (route) => route.path !== "login" && route.path !== "register"
);

export const routes: Routes = [
  // ==========================================
  // 2. RUTAS PÚBLICAS (Sin Layout)
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
  // 3. RUTAS PROTEGIDAS (Con Layout)
  // ==========================================
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        // Redirección por defecto al entrar al layout protegido
        path: "",
        redirectTo: "usuarios", // Cambia a "usuarios" si prefieres que sea el inicio
        pathMatch: "full"
      },
      {
        path: "logistica",
        loadChildren: () =>
          import("./features/logistica/logistica.module").then(
            (m) => m.LogisticaModule
          )
      },
      // Inyectamos las rutas filtradas de core (usuarios, zonas, perfil)
      ...protectedCoreRoutes,
      
      // Wildcard para rutas no encontradas dentro del layout
      {
        path: "**",
        redirectTo: "logistica"
      }
    ]
  },

  // ==========================================
  // 4. REDIRECCIÓN GLOBAL (Si la ruta no existe)
  // ==========================================
  {
    path: "**",
    redirectTo: "/login"
  }
];