// src/app/features/core/components/usuarios/usuario-form/usuario-form.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario, Rol } from '../../../models/usuario.model';
import { RolOption } from '../../../interfaces/core.interface';

function passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const password = group.get('password_hash')?.value;
        const confirm = group.get('confirmPassword')?.value;
        if (!password) return null; // no obligatorio en edición
        return password !== confirm ? { passwordsMismatch: true } : null;
    };
}

@Component({
    selector: 'app-usuario-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './usuario-form.component.html',
    styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly usuarioService = inject(UsuarioService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    readonly loading = signal(false);
    readonly saving = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly isEditMode = signal(false);
    readonly usuarioId = signal<number | null>(null);

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
            rol: ['VOLUNTARIO' as Rol, [Validators.required]],
            habilidades: [''],
            disponible: [false],
            password_hash: [''],
            confirmPassword: ['']
        },
        { validators: passwordsMatchValidator() }
    );

    get nombre() { return this.form.controls.nombre; }
    get email() { return this.form.controls.email; }
    get telefono() { return this.form.controls.telefono; }
    get rol() { return this.form.controls.rol; }
    get habilidades() { return this.form.controls.habilidades; }
    get disponible() { return this.form.controls.disponible; }
    get password_hash() { return this.form.controls.password_hash; }
    get confirmPassword() { return this.form.controls.confirmPassword; }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const id = parseInt(idParam, 10);
            if (isNaN(id)) {
                this.errorMessage.set('ID inválido');
                return;
            }
            this.isEditMode.set(true);
            this.usuarioId.set(id);
            this.loadUsuario(id);
        } else {
            // Crear: password es obligatorio
            this.password_hash.setValidators([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(72)
            ]);
            this.confirmPassword.setValidators([Validators.required]);
            this.password_hash.updateValueAndValidity();
            this.confirmPassword.updateValueAndValidity();
        }
    }

    loadUsuario(id: number): void {
        this.loading.set(true);
        this.usuarioService.findById(id).subscribe({
            next: (u) => {
                this.form.patchValue({
                    nombre: u.nombre,
                    email: u.email,
                    telefono: u.telefono ?? '',
                    rol: u.rol,
                    habilidades: u.habilidades ?? '',
                    disponible: u.disponible
                });
                this.loading.set(false);
            },
            error: (err: Error) => {
                this.errorMessage.set(err.message);
                this.loading.set(false);
            }
        });
    }

    onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving.set(true);
        this.errorMessage.set(null);
        const raw = this.form.getRawValue();

        if (this.isEditMode()) {
            const id = this.usuarioId()!;
            const payload: Partial<Usuario> = {
                nombre: raw.nombre.trim(),
                email: raw.email.trim().toLowerCase(),
                telefono: raw.telefono?.trim() || undefined,
                rol: raw.rol,
                habilidades: raw.habilidades?.trim() || undefined,
                disponible: raw.disponible
            };
            this.usuarioService.update(id, payload).subscribe({
                next: () => this.router.navigate(['/usuarios', id]),
                error: (err: Error) => {
                    this.errorMessage.set(err.message);
                    this.saving.set(false);
                }
            });
        } else {
            const payload: Usuario = {
                nombre: raw.nombre.trim(),
                email: raw.email.trim().toLowerCase(),
                password_hash: raw.password_hash,
                telefono: raw.telefono?.trim() || undefined,
                rol: raw.rol,
                habilidades: raw.habilidades?.trim() || undefined,
                disponible: raw.disponible
            };
            this.usuarioService.create(payload).subscribe({
                next: () => this.router.navigate(['/usuarios']),
                error: (err: Error) => {
                    this.errorMessage.set(err.message);
                    this.saving.set(false);
                }
            });
        }
    }
}