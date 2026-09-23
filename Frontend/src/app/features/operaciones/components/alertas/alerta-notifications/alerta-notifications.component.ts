import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { Alerta } from '../../../models/alerta.model';
import { AlertaService } from '../../../services/alerta.service';

@Component({
  selector: 'app-alerta-notifications',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule
  ],
  templateUrl: './alerta-notifications.component.html',
  styleUrl: './alerta-notifications.component.css'
})
export class AlertaNotificationsComponent implements OnInit {

  alertas: Alerta[] = [];
  loading = false;

  constructor(private alertaService: AlertaService) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  cargarAlertas(): void {
    this.loading = true;

    this.alertaService.getAll().subscribe({
      next: (alertas) => {
        this.alertas = alertas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar las alertas:', error);
        this.loading = false;
      }
    });
  }

  getIconoNivel(nivel: string): string {
    switch (nivel) {
      case 'Informacion':
        return 'info';

      case 'Advertencia':
        return 'warning';

      case 'Critico':
        return 'error';

      default:
        return 'notifications';
    }
  }

  getClaseNivel(nivel: string): string {
    switch (nivel) {
      case 'Informacion':
        return 'nivel-informacion';

      case 'Advertencia':
        return 'nivel-advertencia';

      case 'Critico':
        return 'nivel-critico';

      default:
        return 'nivel-default';
    }
  }

  getIconoTipo(tipo: string): string {
    switch (tipo) {
      case 'Emergencia':
        return 'emergency';

      case 'Recurso':
        return 'inventory_2';

      case 'Refugio':
        return 'home';

      case 'Seguimiento':
        return 'track_changes';

      case 'Otro':
        return 'notifications';

      default:
        return 'notifications';
    }
  }

  marcarComoLeida(alerta: Alerta): void {
    if (alerta.estado === 'Leida') {
      return;
    }

    alerta.estado = 'Leida';
  }

  trackByAlerta(index: number, alerta: Alerta): number {
    return alerta.id;
  }
}