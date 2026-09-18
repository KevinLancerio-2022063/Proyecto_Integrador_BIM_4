import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const platformId = inject(PLATFORM_ID);

    // En SSR no hay localStorage, no interceptamos el token
    if (!isPlatformBrowser(platformId)) {
        return next(req);
    }

    const token = authService.getToken();

    // Clonamos la request agregando el header Authorization
    const authReq = token
        ? req.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              }
          })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Si el backend responde 401, la sesión ya no es válida
            if (error.status === 401) {
                console.warn('[AuthInterceptor] Token inválido o expirado. Cerrando sesión.');
                authService.logout();
            }
            return throwError(() => error);
        })
    );
};