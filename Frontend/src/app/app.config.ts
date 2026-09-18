<<<<<<< HEAD
import { ApplicationConfig, provideZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { routes } from "./app.routes";

// Configura la aplicación en modo zoneless
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient()
  ]
=======
import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import {
    provideClientHydration,
    withEventReplay
} from '@angular/platform-browser';

import { routes } from './app.routes';
import { authInterceptor } from './features/core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(
            withFetch(),
            withInterceptors([authInterceptor])
        )
    ]
>>>>>>> develop
};