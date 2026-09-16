import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // En SSR permitimos el paso para que la hidratación no rompa
    // (el guard se re-ejecuta en el cliente)
    if (!isPlatformBrowser(platformId)) {
        return true;
    }

    // 1. ¿Está autenticado?
    if (!authService.isLoggedIn()) {
        router.navigate(['/login'], {
            queryParams: { returnUrl: state.url }
        });
        return false;
    }

    // 2. ¿Es ADMIN?
    if (!authService.isAdmin()) {
        router.navigate(['/login'], {
            queryParams: { error: 'no-admin' }
        });
        return false;
    }

    return true;
};