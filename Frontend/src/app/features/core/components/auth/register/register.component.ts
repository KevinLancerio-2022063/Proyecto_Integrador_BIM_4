// src/app/features/core/components/auth/register/register.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterData, RolPublico } from '../../../models/usuario.model';
import { RolOption } from '../../../interfaces/core.interface';

function passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const password = group.get('password')?.value;
        const confirm = group.get('confirmPassword')?.value;
        return password && confirm && password !== confirm
            ? { passwordsMismatch: true }
            : null;
    };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    private readonly fb = inject(FormBuilder);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly loading = signal(false);
    readonly errorMessage = signal<string | null>(null);

    readonly roles: RolOption[] = [
        { value: 'VOLUNTARIO', label: 'Voluntario' },
        { value: 'RESCATISTA', label: 'Rescatista' },
        { value: 'GESTOR_REFUGIO', label: 'Gestor de Refugio' }
    ];

    readonly form = this.fb.nonNullable.group(
        {
            nombre: ['', [Validators.required, Validators.maxLength(120)]],
            email: ['', [Validators.required, Validators.email]],
            telefono: ['', [Validators.maxLength(30)]],
            rol: ['VOLUNTARIO' as RolPublico, [Validators.required]],
            habilidades: [''],
            password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(72)]],
            confirmPassword: ['', [Validators.required]]
        },
        { validators: passwordsMatchValidator() }
    );

    get nombre() { return this.form.controls.nombre; }
    get email() { return this.form.controls.email; }
    get telefono() { return this.form.controls.telefono; }
    get rol() { return this.form.controls.rol; }
    get habilidades() { return this.form.controls.habilidades; }
    get password() { return this.form.controls.password; }
    get confirmPassword() { return this.form.controls.confirmPassword; }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        this.errorMessage.set(null);

        const raw = this.form.getRawValue();
        const data: RegisterData = {
            nombre: raw.nombre.trim(),
            email: raw.email.trim().toLowerCase(),
            password: raw.password,
            telefono: raw.telefono?.trim() || undefined,
            rol: raw.rol,
            habilidades: raw.habilidades?.trim() || undefined,
            disponible: false
        };

        this.authService.register(data).subscribe({
            next: () => {
                // Auto-login: el backend devolvió token. Vamos directo a usuarios.
                this.router.navigateByUrl('/usuarios');
            },
            error: (err: Error) => {
                this.errorMessage.set(err.message);
                this.loading.set(false);
            },
            complete: () => this.loading.set(false)
        });
    }
}