// src/app/features/core/components/usuarios/usuario-detail/usuario-detail.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { AuthService } from '../../../services/auth.service';
import { UsuarioResponse } from '../../../models/usuario.model';
import { RolLabelPipe } from '../../../pipes/rol-label.pipe';
import { DisponiblePipe } from '../../../pipes/disponible.pipe';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { TelefonoPipe } from '../../../pipes/telefono.pipe';

@Component({
    selector: 'app-usuario-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        RolLabelPipe,
        DisponiblePipe,
        FechaPipe,
        TelefonoPipe
    ],
    templateUrl: './usuario-detail.component.html',
    styleUrls: ['./usuario-detail.component.css']
})
export class UsuarioDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly usuarioService = inject(UsuarioService);
    readonly authService = inject(AuthService);

    readonly usuario = signal<UsuarioResponse | null>(null);
    readonly loading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (!idParam) {
            this.errorMessage.set('ID no proporcionado');
            return;
        }
        const id = parseInt(idParam, 10);
        if (isNaN(id)) {
            this.errorMessage.set('ID inválido');
            return;
        }
        this.loadUsuario(id);
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