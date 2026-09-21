// src/app/features/core/components/usuarios/usuario-list/usuario-list.component.ts

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioResponse } from '../../../models/usuario.model';

import { RolLabelPipe } from '../../../pipes/rol-label.pipe';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { TelefonoPipe } from '../../../pipes/telefono.pipe';

@Component({
    selector: 'app-usuario-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        RolLabelPipe,
        FechaPipe,
        TelefonoPipe
    ],
    templateUrl: './usuario-list.component.html',
    styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {

    private readonly usuarioService = inject(UsuarioService);

    public readonly authService = inject(AuthService);

    readonly usuarios = signal<UsuarioResponse[]>([]);
    readonly loading = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly searchTerm = signal('');
    readonly deletingId = signal<number | null>(null);
    readonly successMessage = signal<string | null>(null);

    readonly isAdmin = computed(() => this.authService.isAdmin());

    readonly filteredUsuarios = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();

        if (!term) {
            return this.usuarios();
        }

        return this.usuarios().filter(
            (u) =>
                u.nombre.toLowerCase().includes(term) ||
                u.email.toLowerCase().includes(term) ||
                u.rol.toLowerCase().includes(term)
        );
    });

    ngOnInit(): void {
        this.loadUsuarios();
    }

    /**
     * Convierte el rol recibido del backend
     * en una clase CSS compatible con los badges.
     *
     * Ejemplos:
     *
     * "Voluntario"        -> "voluntario"
     * "VOLUNTARIO"        -> "voluntario"
     * "Gestor de Refugio" -> "gestor-de-refugio"
     * "GESTOR_REFUGIO"    -> "gestor-refugio"
     * "Administrador"     -> "administrador"
     * "ADMINISTRADOR"     -> "administrador"
     */
    rolClass(rol: string): string {

        const normalized = rol
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[_\s]+/g, '-');

        switch (normalized) {

            case 'admin':
            case 'administrador':
                return 'administrador';

            case 'gestor-refugio':
            case 'gestor-de-refugio':
                return 'gestor-de-refugio';

            case 'voluntario':
                return 'voluntario';

            case 'rescatista':
                return 'rescatista';

            case 'coordinador':
                return 'coordinador';

            default:
                return normalized;
        }
    }

    loadUsuarios(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.usuarioService.findAll().subscribe({
            next: (data) => {
                this.usuarios.set(data);
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

    confirmDelete(usuario: UsuarioResponse): void {

        if (
            !confirm(
                `¿Eliminar a "${usuario.nombre}"? Esta acción es un soft delete.`
            )
        ) {
            return;
        }

        this.deletingId.set(usuario.id);

        this.usuarioService.delete(usuario.id).subscribe({

            next: () => {

                this.usuarios.update((list) =>
                    list.filter((u) => u.id !== usuario.id)
                );

                this.successMessage.set(
                    `Usuario "${usuario.nombre}" eliminado`
                );

                this.deletingId.set(null);

                setTimeout(() => {
                    this.successMessage.set(null);
                }, 3000);
            },

            error: (err: Error) => {

                this.errorMessage.set(err.message);

                this.deletingId.set(null);
            }
        });
    }

    logout(): void {
        this.authService.logout();
    }
}
