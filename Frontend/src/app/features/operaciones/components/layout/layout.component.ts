// Importa las dependencias necesarias de Angular
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

// Define el componente como independiente
@Component({
  selector: "app-layout",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.css"]
})
export class LayoutComponent {
  // Define los enlaces del menú lateral
  menuItems = [
    {
      label: "Alertas",
      route: "/alertas",
      icon: "notifications"
    }
  ];
}