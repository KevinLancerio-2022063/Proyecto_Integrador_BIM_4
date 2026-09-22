// src/app/features/core/components/zonas/zona-list/zona-list.component.ts

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ZonaService } from '../../../services/zona.service';
import { AuthService } from '../../../services/auth.service';
import { ZonaResponse } from '../../../models/zona.model';
import { NivelRiesgoPipe } from '../../../pipes/nivel-riesgo.pipe';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { CoordenadasPipe } from '../../../pipes/coordenadas.pipe';

@Component({
    selector: 'app-zona-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        NivelRiesgoPipe,
        FechaPipe,
        CoordenadasPipe
    ],
    templateUrl: './zona-list.component.html',
    styleUrls: ['./zona-list.component.css']
})
export class ZonaListComponent implements OnInit {
    private readonly zonaService = inject(ZonaService);
    readonly authService = inject(AuthService);

    readonly zonas = signal<ZonaResponse[]>([]);
    readonly loading = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly searchTerm = signal('');
    readonly filterNivel = signal<string>('');
    readonly deletingId = signal<number | null>(null);
    readonly successMessage = signal<string | null>(null);

    // Señales para el modal personalizado de eliminación
    readonly showDeleteModal = signal<boolean>(false);
    readonly zonaToDelete = signal<ZonaResponse | null>(null);

    readonly isAdmin = computed(() => this.authService.isAdmin());

    readonly filteredZonas = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        const nivel = this.filterNivel();

        return this.zonas().filter((z) => {
            const matchTerm =
                !term ||
                z.nombre.toLowerCase().includes(term) ||
                (z.municipio ?? '').toLowerCase().includes(term) ||
                (z.departamento ?? '').toLowerCase().includes(term);

            const matchNivel = !nivel || z.nivel_riesgo === nivel;

            return matchTerm && matchNivel;
        });
    });

    ngOnInit(): void {
        this.loadZonas();
    }

    loadZonas(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.zonaService.findAll().subscribe({
            next: (data) => {
                this.zonas.set(data);
                this.loading.set(false);
            },
            error: (err: Error) => {
                this.errorMessage.set(err.message);
                this.loading.set(false);
            }
        });
    }

    onSearchChange(value: string): void {
        this.searchTerm.set(value);
    }

    onNivelChange(value: string): void {
        this.filterNivel.set(value);
    }

    // Abre el modal personalizado
    confirmDelete(zona: ZonaResponse): void {
        this.zonaToDelete.set(zona);
        this.showDeleteModal.set(true);
    }

    // Cierra el modal y limpia la selección
    cancelDelete(): void {
        this.showDeleteModal.set(false);
        this.zonaToDelete.set(null);
    }

    // Ejecuta la eliminación real desde el modal
    deleteConfirmed(): void {
        const zona = this.zonaToDelete();
        if (!zona) return;

        this.deletingId.set(zona.id);

        this.zonaService.delete(zona.id).subscribe({
            next: () => {
                this.zonas.update((list) =>
                    list.filter((z) => z.id !== zona.id)
                );

                this.successMessage.set(`Zona "${zona.nombre}" eliminada`);
                
                // Cerrar modal y limpiar estados
                this.showDeleteModal.set(false);
                this.zonaToDelete.set(null);
                this.deletingId.set(null);

                setTimeout(() => this.successMessage.set(null), 3000);
            },
            error: (err: Error) => {
                this.errorMessage.set(err.message || 'Error al eliminar la zona');
                this.deletingId.set(null);
            }
        });
    }

    logout(): void {
        this.authService.logout();
    }
}