// src/app/features/core/services/auth.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    AuthResponse,
    JwtPayload,
    LoginCredentials,
    RegisterData,
    Rol,
    UsuarioResponse
} from '../models/usuario.model';
import { ApiError } from '../interfaces/core.interface';

const TOKEN_KEY = 'siged_token';
const USER_KEY = 'siged_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly platformId = inject(PLATFORM_ID);

    private readonly apiUrl = `${environment.apiUrl}/auth`;

    private readonly currentUserSubject = new BehaviorSubject<UsuarioResponse | null>(
        this.loadUserFromStorage()
    );
    public readonly currentUser$ = this.currentUserSubject.asObservable();

    private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    // ============ LOGIN ============
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError((error) => this.handleHttpError(error, 'Error al iniciar sesión'))
        );
    }

    // ============ REGISTER ============
    register(data: RegisterData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError((error) => this.handleHttpError(error, 'Error al registrarse'))
        );
    }

    // ============ LOGOUT ============
    logout(): void {
        this.clearStorage();
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
    }

    // ============ GETTERS ============
    getToken(): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        return localStorage.getItem(TOKEN_KEY);
    }

    getCurrentUser(): UsuarioResponse | null {
        return this.currentUserSubject.value;
    }

    getRol(): Rol | null {
        return this.getCurrentUser()?.rol ?? null;
    }

    isAdmin(): boolean {
        return this.getRol() === 'ADMIN';
    }

    isLoggedIn(): boolean {
        return this.hasToken();
    }

    decodeToken(token: string): JwtPayload | null {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload)) as JwtPayload;
        } catch {
            return null;
        }
    }

    // ============ PRIVADOS ============
    private handleAuthSuccess(response: AuthResponse): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(TOKEN_KEY, response.token);
            localStorage.setItem(USER_KEY, JSON.stringify(response.usuario));
        }
        this.currentUserSubject.next(response.usuario);
        this.isAuthenticatedSubject.next(true);
    }

    private handleHttpError(
        error: { status?: number; error?: ApiError },
        fallback: string
    ): Observable<never> {
        let message = fallback;
        if (error.status === 0) {
            message = 'No se pudo conectar con el servidor';
        } else if (error.status === 400 && error.error?.errors?.length) {
            message = error.error.errors.join(', ');
        } else if (error.status === 401) {
            message = error.error?.message ?? 'Credenciales inválidas';
        } else if (error.status === 409) {
            message = error.error?.message ?? 'El recurso ya existe';
        } else if (error.error?.message) {
            message = error.error.message;
        }
        return throwError(() => new Error(message));
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }

    private loadUserFromStorage(): UsuarioResponse | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as UsuarioResponse;
        } catch {
            return null;
        }
    }

    private clearStorage(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
}