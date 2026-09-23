import {
    Component,
    inject,
    OnInit,
    signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
    ActivatedRoute,
    RouterLink
} from '@angular/router';

import {
    DomSanitizer,
    SafeResourceUrl
} from '@angular/platform-browser';

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

    // =====================================================
    // SERVICIOS
    // =====================================================

    private readonly route = inject(ActivatedRoute);

    private readonly zonaService = inject(ZonaService);

    readonly authService = inject(AuthService);

    private readonly sanitizer = inject(DomSanitizer);


    // =====================================================
    // ESTADO
    // =====================================================

    readonly zona = signal<ZonaResponse | null>(null);

    readonly loading = signal(false);

    readonly errorMessage = signal<string | null>(null);


    /**
     * URL segura utilizada por el iframe del mapa.
     *
     * Angular requiere SafeResourceUrl para permitir
     * contenido externo dentro de un iframe.
     */
    readonly mapUrl = signal<SafeResourceUrl | null>(null);


    // =====================================================
    // INICIALIZACIÓN
    // =====================================================

    ngOnInit(): void {

        const idParam =
            this.route.snapshot.paramMap.get('id');


        // -------------------------------------------------
        // VALIDAR ID
        // -------------------------------------------------

        if (!idParam) {

            this.errorMessage.set(
                'ID no proporcionado'
            );

            return;
        }


        const id =
            parseInt(idParam, 10);


        if (isNaN(id)) {

            this.errorMessage.set(
                'ID inválido'
            );

            return;
        }


        // -------------------------------------------------
        // CARGAR ZONA
        // -------------------------------------------------

        this.loadZona(id);
    }


    // =====================================================
    // CARGAR ZONA
    // =====================================================

    loadZona(id: number): void {

        this.loading.set(true);

        this.errorMessage.set(null);

        this.zonaService.findById(id).subscribe({

            next: (z) => {

                // -----------------------------------------
                // GUARDAR ZONA
                // -----------------------------------------

                this.zona.set(z);


                // -----------------------------------------
                // GENERAR URL DEL MAPA
                // -----------------------------------------

                this.mapUrl.set(
                    this.createMapEmbedUrl(z)
                );


                // -----------------------------------------
                // FINALIZAR CARGA
                // -----------------------------------------

                this.loading.set(false);
            },


            error: (err: Error) => {

                this.errorMessage.set(
                    err.message
                );

                this.mapUrl.set(null);

                this.loading.set(false);
            }

        });
    }


    // =====================================================
    // URL PARA MAPA EMBEBIDO
    // =====================================================

    /**
     * Construye la URL de OpenStreetMap que se utilizará
     * dentro del iframe.
     *
     * No cambia la forma en que se obtienen los datos.
     * Solamente utiliza las coordenadas que ya devuelve
     * ZonaService.findById().
     */
    private createMapEmbedUrl(
        zona: ZonaResponse
    ): SafeResourceUrl | null {

        // -------------------------------------------------
        // VALIDAR COORDENADAS
        // -------------------------------------------------

        if (
            zona.latitud == null ||
            zona.longitud == null
        ) {

            return null;
        }


        const lat =
            Number(zona.latitud);

        const lng =
            Number(zona.longitud);


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {

            return null;
        }


        // -------------------------------------------------
        // ÁREA VISIBLE DEL MAPA
        // -------------------------------------------------

        /*
         * Define cuánto territorio queremos mostrar
         * alrededor del punto.
         *
         * Un delta de 0.015 ofrece una vista bastante
         * cercana a la zona.
         */

        const delta = 0.015;


        const minLng =
            lng - delta;

        const minLat =
            lat - delta;

        const maxLng =
            lng + delta;

        const maxLat =
            lat + delta;


        // -------------------------------------------------
        // BOUNDING BOX DE OPENSTREETMAP
        // -------------------------------------------------

        const bbox =
            `${minLng},${minLat},${maxLng},${maxLat}`;


        // -------------------------------------------------
        // URL DEL MAPA
        // -------------------------------------------------

        const url =
            'https://www.openstreetmap.org/export/embed.html' +
            `?bbox=${bbox}` +
            '&layer=mapnik' +
            `&marker=${lat},${lng}`;


        // -------------------------------------------------
        // URL SEGURA PARA ANGULAR
        // -------------------------------------------------

        return this.sanitizer
            .bypassSecurityTrustResourceUrl(url);
    }


    // =====================================================
    // URL EXTERNA
    // =====================================================

    /**
     * Mantiene la URL externa para el botón
     * "Abrir mapa completo".
     *
     * Esta función NO se utiliza para el iframe.
     */
    getMapUrl(): string | null {

        const z = this.zona();


        if (
            !z ||
            z.latitud == null ||
            z.longitud == null
        ) {

            return null;
        }


        const lat =
            Number(z.latitud);

        const lng =
            Number(z.longitud);


        if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
        ) {

            return null;
        }


        return (
            `https://www.openstreetmap.org/` +
            `?mlat=${lat}` +
            `&mlon=${lng}` +
            `#map=13/${lat}/${lng}`
        );
    }

}