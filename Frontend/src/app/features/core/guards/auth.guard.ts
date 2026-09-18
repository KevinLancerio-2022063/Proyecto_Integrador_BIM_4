// src/app/features/core/guards/auth.guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Solo valida que haya sesión activa.
 * Uso: /zonas, /perfil → cualquier rol autenticado.
 */
export const authGuard: CanActivateFn = (
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) return true;

    if (!authService.isLoggedIn()) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
    return true;
};

/**
 * Valida sesión + rol ADMIN.
 * Uso: /usuarios/** → solo admin.
 */
export const adminGuard: CanActivateFn = (
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) return true;

    if (!authService.isLoggedIn()) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    if (!authService.isAdmin()) {
        router.navigate(['/login'], { queryParams: { error: 'no-admin' } });
        return false;
    }
    return true;
};