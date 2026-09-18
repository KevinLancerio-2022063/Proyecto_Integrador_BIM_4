// src/app/features/core/components/zonas/zona-detail/zona-detail.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ZonaService } from '../../../services/zona.service';
import { AuthService } from '../../../services/auth.service';
import { ZonaResponse } from '../../../models/zona.model';
import { NivelRiesgoPipe } from '../../../pipes/nivel-riesgo.pipe';
import { FechaPipe } from '../../../pipes/fecha.pipe';
import { CoordenadasPipe } from '../../../pipes/coordenadas.pipe';

@Component({
    selector: 'app-zona-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        NivelRiesgoPipe,
        FechaPipe,
        CoordenadasPipe
    ],
    templateUrl: './zona-detail.component.html',
    styleUrls: ['./zona-detail.component.css']
})
export class ZonaDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly zonaService = inject(ZonaService);
    readonly authService = inject(AuthService);

    readonly zona = signal<ZonaResponse | null>(null);
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
        this.loadZona(id);
    }

    loadZona(id: number): void {
        this.loading.set(true);
        this.zonaService.findById(id).subscribe({
            next: (z) => {
                this.zona.set(z);
                this.loading.set(false);
            },
            error: (err: Error) => {
                this.errorMessage.set(err.message);
                this.loading.set(false);
            }
        });
    }

    /**
     * Construye URL de OpenStreetMap para el link "Ver en mapa".
     * Nota: por ahora solo link externo. Si después quieres mapa embebido,
     * se puede agregar Leaflet en el diseño (ver guía para la IA de diseño).
     */
    getMapUrl(): string | null {
        const z = this.zona();
        if (!z || z.latitud == null || z.longitud == null) return null;
        const lat = Number(z.latitud);
        const lng = Number(z.longitud);
        if (isNaN(lat) || isNaN(lng)) return null;
        return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`;
    }
}