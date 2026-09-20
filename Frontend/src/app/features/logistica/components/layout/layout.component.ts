// src/app/features/logistica/components/layout/layout.component.ts

import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
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

  // Menú maestro con todas las entidades y los roles que pueden verlas
  private masterMenuItems = [
    { label: "Dashboard", route: "/logistica/dashboard", icon: "dashboard", roles: ["ADMIN", "COORDINADOR", "RESCATISTA", "VOLUNTARIO", "GESTOR_REFUGIO"] as Rol[] },
    { label: "Recursos", route: "/logistica/recursos", icon: "inventory_2", roles: ["ADMIN", "COORDINADOR", "RESCATISTA", "VOLUNTARIO", "GESTOR_REFUGIO"] as Rol[] },
    { label: "Refugios", route: "/logistica/refugios", icon: "home", roles: ["ADMIN", "COORDINADOR", "RESCATISTA", "VOLUNTARIO", "GESTOR_REFUGIO"] as Rol[] },
    { label: "Asignaciones", route: "/logistica/asignaciones", icon: "assignment", roles: ["ADMIN", "COORDINADOR", "RESCATISTA", "VOLUNTARIO", "GESTOR_REFUGIO"] as Rol[] },
    
    // Nuevas entidades de Incidentes
    { label: "Incidentes", route: "/incidentes", icon: "warning", roles: ["ADMIN", "COORDINADOR", "RESCATISTA"] as Rol[] },
    { label: "Historial", route: "/incidentes/historial", icon: "history", roles: ["ADMIN", "COORDINADOR", "RESCATISTA"] as Rol[] },
    
    // Nuevas entidades de Operaciones
    { label: "Alertas", route: "/operaciones/alertas", icon: "notifications", roles: ["ADMIN", "COORDINADOR", "RESCATISTA"] as Rol[] },
    { label: "Asignar Personal", route: "/operaciones/asignaciones-personal", icon: "group_add", roles: ["ADMIN", "COORDINADOR", "RESCATISTA"] as Rol[] },
    
    // Entidades de administración (Core)
    { label: "Usuarios", route: "/usuarios", icon: "people", roles: ["ADMIN", "COORDINADOR"] as Rol[] },
    { label: "Zonas", route: "/zonas", icon: "map", roles: ["ADMIN"] as Rol[] }
  ];

  // Getter que filtra el menú dinámicamente según el rol del usuario logueado
  get menuItems() {
    const currentRole = this.authService.getRol();
    if (!currentRole) return [];
    
    return this.masterMenuItems.filter(item => item.roles.includes(currentRole));
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();
  }
}