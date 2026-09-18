// src/app/features/core/components/auth/login/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginCredentials } from '../../../models/usuario.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    readonly loading = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly successMessage = signal<string | null>(null);

    readonly form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    constructor() {
        // Si viene redirigido por register
        if (this.route.snapshot.queryParamMap.get('registered') === 'true') {
            this.successMessage.set('Cuenta creada exitosamente. Inicia sesión.');
        }
        // Si viene redirigido por guard sin ser ADMIN
        if (this.route.snapshot.queryParamMap.get('error') === 'no-admin') {
            this.errorMessage.set('Acceso denegado. Solo administradores.');
        }
    }

    get email() {
        return this.form.controls.email;
    }

    get password() {
        return this.form.controls.password;
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        const credentials: LoginCredentials = this.form.getRawValue();

        this.authService.login(credentials).subscribe({
            next: () => {
                const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/usuarios';
                this.router.navigateByUrl(returnUrl);
            },
            error: (err: Error) => {
                this.errorMessage.set(err.message);
                this.loading.set(false);
            },
            complete: () => this.loading.set(false)
        });
    }
}