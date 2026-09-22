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
 * Si no es admin, lo redirige a dashboard (no a login)
 */
export const adminGuard: CanActivateFn = (
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) return true;

    // Si no está logueado, redirigir a login
    if (!authService.isLoggedIn()) {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    // Si está logueado pero NO es admin, redirigir a dashboard (NO a login)
    if (!authService.isAdmin()) {
        // Mostrar mensaje de error opcional
        console.warn('Acceso denegado: Se requiere rol ADMIN para acceder a', state.url);
        
        // Redirigir a una página segura
        router.navigate(['/logistica/dashboard']);
        return false;
    }
    
    return true;
};