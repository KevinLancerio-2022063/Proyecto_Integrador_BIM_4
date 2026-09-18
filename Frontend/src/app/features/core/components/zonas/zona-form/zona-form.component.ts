// src/app/features/core/components/zonas/zona-form/zona-form.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ZonaService } from '../../../services/zona.service';
import { Zona, NivelRiesgo } from '../../../models/zona.model';

@Component({
    selector: 'app-zona-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './zona-form.component.html',
    styleUrls: ['./zona-form.component.css']
})
export class ZonaFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly zonaService = inject(ZonaService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    readonly loading = signal(false);
    readonly saving = signal(false);
    readonly errorMessage = signal<string | null>(null);
    readonly isEditMode = signal(false);
    readonly zonaId = signal<number | null>(null);

    readonly niveles: NivelRiesgo[] = ['BAJO', 'MEDIO', 'ALTO', 'CRITICO'];

    readonly form = this.fb.nonNullable.group({
        nombre: ['', [Validators.required, Validators.maxLength(120)]],
        municipio: ['', [Validators.maxLength(120)]],
        departamento: ['', [Validators.maxLength(120)]],
        pais: ['Guatemala', [Validators.required, Validators.maxLength(80)]],
        latitud: [null as number | null, [Validators.min(-90), Validators.max(90)]],
        longitud: [null as number | null, [Validators.min(-180), Validators.max(180)]],
        nivel_riesgo: ['MEDIO' as NivelRiesgo, [Validators.required]]
    });

    get nombre() { return this.form.controls.nombre; }
    get municipio() { return this.form.controls.municipio; }
    get departamento() { return this.form.controls.departamento; }
    get pais() { return this.form.controls.pais; }
    get latitud() { return this.form.controls.latitud; }
    get longitud() { return this.form.controls.longitud; }
    get nivel_riesgo() { return this.form.controls.nivel_riesgo; }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            const id = parseInt(idParam, 10);
            if (isNaN(id)) {
                this.errorMessage.set('ID inválido');
                return;
            }
            this.isEditMode.set(true);
            this.zonaId.set(id);
            this.loadZona(id);
        }
    }

    loadZona(id: number): void {
        this.loading.set(true);
        this.zonaService.findById(id).subscribe({
            next: (z) => {
                this.form.patchValue({
                    nombre: z.nombre,
                    municipio: z.municipio ?? '',
                    departamento: z.departamento ?? '',
                    pais: z.pais,
                    latitud: z.latitud != null ? Number(z.latitud) : null,
                    longitud: z.longitud != null ? Number(z.longitud) : null,
                    nivel_riesgo: z.nivel_riesgo
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

        const payload: Zona = {
            nombre: raw.nombre.trim(),
            municipio: raw.municipio?.trim() || undefined,
            departamento: raw.departamento?.trim() || undefined,
            pais: raw.pais.trim() || 'Guatemala',
            latitud: raw.latitud != null ? Number(raw.latitud) : undefined,
            longitud: raw.longitud != null ? Number(raw.longitud) : undefined,
            nivel_riesgo: raw.nivel_riesgo
        };

        if (this.isEditMode()) {
            const id = this.zonaId()!;
            this.zonaService.update(id, payload).subscribe({
                next: () => this.router.navigate(['/zonas', id]),
                error: (err: Error) => {
                    this.errorMessage.set(err.message);
                    this.saving.set(false);
                }
            });
        } else {
            this.zonaService.create(payload).subscribe({
                next: () => this.router.navigate(['/zonas']),
                error: (err: Error) => {
                    this.errorMessage.set(err.message);
                    this.saving.set(false);
                }
            });
        }
    }
}