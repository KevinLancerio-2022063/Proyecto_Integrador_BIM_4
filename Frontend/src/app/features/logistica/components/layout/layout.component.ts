import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../../core/services/auth.service";
import { Rol } from "../../../core/models/usuario.model";

@Component({
  selector: "app-layout",
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  private masterMenuItems = [
    { label: "Dashboard", route: "/logistica/dashboard", icon: "dashboard", roles: ["ADMIN", "COORDINADOR", "RESCATISTA", "VOLUNTARIO", "GESTOR_REFUGIO"] as Rol[] },
    { label: "Recursos", route: "/logistica/recursos", icon: "inventory_2", roles: ["ADMIN", "COORDINADOR", "RESCATISTA", "VOLUNTARIO", "GESTOR_REFUGIO"] as Rol[] },
    { label: "Refugios", route: "/logistica/refugios", icon: "home", roles: ["ADMIN", "COORDINADOR", "RESCATISTA", "VOLUNTARIO", "GESTOR_REFUGIO"] as Rol[] },
    { label: "Asignaciones", route: "/logistica/asignaciones", icon: "assignment", roles: ["ADMIN", "COORDINADOR", "RESCATISTA", "VOLUNTARIO", "GESTOR_REFUGIO"] as Rol[] },
    { label: "Incidentes", route: "/incidentes", icon: "warning", roles: ["ADMIN", "COORDINADOR", "RESCATISTA"] as Rol[] },
    { label: "Historial", route: "/incidentes/historial", icon: "history", roles: ["ADMIN", "COORDINADOR", "RESCATISTA"] as Rol[] },
    { label: "Alertas", route: "/operaciones/alertas", icon: "notifications", roles: ["ADMIN", "COORDINADOR", "RESCATISTA"] as Rol[] },
    { label: "Asignar Personal", route: "/operaciones/asignaciones-personal", icon: "group_add", roles: ["ADMIN", "COORDINADOR", "RESCATISTA"] as Rol[] },
    { label: "Usuarios", route: "/usuarios", icon: "people", roles: ["ADMIN", "COORDINADOR"] as Rol[] },
    { label: "Zonas", route: "/zonas", icon: "map", roles: ["ADMIN"] as Rol[] }
  ];

  get menuItems() {
    const currentRole = this.authService.getRol();
    if (!currentRole) return [];
    return this.masterMenuItems.filter(item => item.roles.includes(currentRole));
  }

  // Verifica si la ruta está activa para resaltar el botón del sidebar
  isActive(route: string): boolean {
    const currentUrl = this.router.url.split('?')[0].split('#')[0];
    
    // Historial debe coincidir exactamente con /incidentes/historial o sus hijos
    if (route === "/incidentes/historial") {
      return currentUrl === "/incidentes/historial" || 
             currentUrl.startsWith("/incidentes/historial/");
    }
    
    // Incidentes debe coincidir con /incidentes o /incidentes/incidentes pero no /incidentes/historial
    if (route === "/incidentes") {
      return currentUrl === "/incidentes" || 
             currentUrl === "/incidentes/" ||
             currentUrl.startsWith("/incidentes/incidentes") ||
             (currentUrl.startsWith("/incidentes/") && !currentUrl.startsWith("/incidentes/historial"));
    }
    
    // Caso general para otras rutas
    return currentUrl === route || currentUrl.startsWith(route + "/");
  }

  logout(): void {
    this.authService.logout();
  }
}