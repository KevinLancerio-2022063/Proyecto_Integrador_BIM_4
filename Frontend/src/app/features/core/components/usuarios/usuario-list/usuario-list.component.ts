import {
    Component,
    inject,
    OnInit,
    signal,
    computed
} from '@angular/core';

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

    styleUrls: [
        './usuario-list.component.css'
    ]
})
export class UsuarioListComponent implements OnInit {

    private readonly usuarioService =
        inject(UsuarioService);

    public readonly authService =
        inject(AuthService);


    // =====================================================
    // SIGNALS
    // =====================================================

    readonly usuarios =
        signal<UsuarioResponse[]>([]);

    readonly loading =
        signal(false);

    readonly errorMessage =
        signal<string | null>(null);

    readonly searchTerm =
        signal('');

    readonly deletingId =
        signal<number | null>(null);

    readonly successMessage =
        signal<string | null>(null);


    // =====================================================
    // MODAL DE ELIMINACIÓN
    // =====================================================

    readonly showDeleteModal =
        signal(false);

    readonly usuarioToDelete =
        signal<UsuarioResponse | null>(null);


    // =====================================================
    // ADMIN
    // =====================================================

    readonly isAdmin =
        computed(() => this.authService.isAdmin());


    // =====================================================
    // USUARIOS FILTRADOS
    // =====================================================

    readonly filteredUsuarios = computed(() => {

        const term =
            this.searchTerm()
                .toLowerCase()
                .trim();


        if (!term) {
            return this.usuarios();
        }


        return this.usuarios().filter(
            (u) =>
                u.nombre
                    .toLowerCase()
                    .includes(term)

                ||

                u.email
                    .toLowerCase()
                    .includes(term)

                ||

                u.rol
                    .toLowerCase()
                    .includes(term)
        );
    });


    // =====================================================
    // INIT
    // =====================================================

    ngOnInit(): void {

        this.loadUsuarios();

    }


    // =====================================================
    // CLASE DEL ROL
    // =====================================================

    rolClass(rol: string): string {

        const normalized = rol
            .toLowerCase()
            .normalize('NFD')
            .replace(
                /[\u0300-\u036f]/g,
                ''
            )
            .replace(
                /[_\s]+/g,
                '-'
            );


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


    // =====================================================
    // CARGAR USUARIOS
    // =====================================================

    loadUsuarios(): void {

        this.loading.set(true);

        this.errorMessage.set(null);


        this.usuarioService.findAll().subscribe({

            next: (data) => {

                this.usuarios.set(data);

                this.loading.set(false);
            },


            error: (err: Error) => {

                this.errorMessage.set(
                    err.message
                );

                this.loading.set(false);
            }

        });
    }


    // =====================================================
    // BUSCAR
    // =====================================================

    onSearchChange(value: string): void {

        this.searchTerm.set(value);

    }


    // =====================================================
    // ABRIR MODAL
    // =====================================================

    confirmDelete(
        usuario: UsuarioResponse
    ): void {

        this.usuarioToDelete.set(usuario);

        this.showDeleteModal.set(true);

    }


    // =====================================================
    // CANCELAR ELIMINACIÓN
    // =====================================================

    cancelDelete(): void {

        // No permitir cerrar mientras
        // se está realizando la petición.
        if (this.deletingId() !== null) {

            return;
        }


        this.showDeleteModal.set(false);

        this.usuarioToDelete.set(null);

    }


    // =====================================================
    // CONFIRMAR ELIMINACIÓN
    // =====================================================

    deleteConfirmed(): void {

        const usuario =
            this.usuarioToDelete();


        // Seguridad adicional
        if (!usuario) {

            return;
        }


        // Mostrar estado de eliminación
        this.deletingId.set(
            usuario.id
        );


        this.errorMessage.set(null);


        // Llamada al backend
        this.usuarioService
            .delete(usuario.id)
            .subscribe({

                // -----------------------------------------
                // ÉXITO
                // -----------------------------------------

                next: () => {

                    // Eliminar de la lista local
                    this.usuarios.update(
                        (list) =>
                            list.filter(
                                (u) =>
                                    u.id !== usuario.id
                            )
                    );


                    // Cerrar modal
                    this.showDeleteModal.set(
                        false
                    );


                    // Limpiar usuario seleccionado
                    this.usuarioToDelete.set(
                        null
                    );


                    // Finalizar loading
                    this.deletingId.set(
                        null
                    );


                    // Mensaje
                    this.successMessage.set(
                        `Usuario "${usuario.nombre}" eliminado`
                    );


                    // Ocultar mensaje
                    setTimeout(() => {

                        this.successMessage.set(
                            null
                        );

                    }, 3000);
                },


                // -----------------------------------------
                // ERROR
                // -----------------------------------------

                error: (err: Error) => {

                    this.errorMessage.set(
                        err.message
                    );


                    this.deletingId.set(
                        null
                    );

                }

            });
    }


    // =====================================================
    // LOGOUT
    // =====================================================

    logout(): void {

        this.authService.logout();

    }

}
