// src/app/features/core/components/usuarios/usuario-profile/usuario-profile.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioResponse } from '../../../models/usuario.model';
import { RolLabelPipe } from '../../../pipes/rol-label.pipe';
import { DisponiblePipe } from '../../../pipes/disponible.pipe';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { TelefonoPipe } from '../../../pipes/telefono.pipe';

@Component({
    selector: 'app-usuario-profile',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RolLabelPipe,
        DisponiblePipe,
        FechaPipe,
        TelefonoPipe
    ],
    templateUrl: './usuario-profile.component.html',
    styleUrls: ['./usuario-profile.component.css']
})
export class UsuarioProfileComponent implements OnInit {
    private readonly usuarioService = inject(UsuarioService);
    private readonly authService = inject(AuthService);

    readonly usuario = signal<UsuarioResponse | null>(null);
    readonly loading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        const current = this.authService.getCurrentUser();
        if (!current) {
            this.errorMessage.set('No hay sesión activa');
            return;
        }
        this.loadUsuario(current.id);
    }

    loadUsuario(id: number): void {
        this.loading.set(true);
        this.usuarioService.findById(id).subscribe({
            next: (u) => {
                this.usuario.set(u);
                this.loading.set(false);
            },
            error: (err: Error) => {
                this.errorMessage.set(err.message);
                this.loading.set(false);
            }
        });
    }
}