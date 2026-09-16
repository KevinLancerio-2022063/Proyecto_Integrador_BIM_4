import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
    Usuario,
    UsuarioResponse
} from '../models/usuario.model';
import { ApiError, ApiMessage } from '../interfaces/core.interface';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/usuarios`;

    // ============ READ ============

    findAll(): Observable<UsuarioResponse[]> {
        return this.http
            .get<UsuarioResponse[]>(this.apiUrl)
            .pipe(catchError(this.handleError));
    }

    findById(id: number): Observable<UsuarioResponse> {
        return this.http
            .get<UsuarioResponse>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    // ============ CREATE / UPDATE / DELETE ============

    create(usuario: Usuario): Observable<ApiMessage> {
        return this.http
            .post<ApiMessage>(this.apiUrl, usuario)
            .pipe(catchError(this.handleError));
    }

    update(id: number, usuario: Partial<Usuario>): Observable<ApiMessage> {
        return this.http
            .put<ApiMessage>(`${this.apiUrl}/${id}`, usuario)
            .pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<ApiMessage> {
        return this.http
            .delete<ApiMessage>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    // ============ MANEJO DE ERRORES ============

    private handleError(error: HttpErrorResponse): Observable<never> {
        let message = 'Ocurrió un error inesperado';

        if (error.status === 0) {
            message = 'No se pudo conectar con el servidor';
        } else if (error.status === 400 && error.error?.errors?.length) {
            message = error.error.errors.join(', ');
        } else if (error.status === 401) {
            message = 'Sesión expirada. Inicia sesión nuevamente';
        } else if (error.status === 403) {
            message = 'No tienes permisos para esta acción';
        } else if (error.status === 404) {
            message = error.error?.message ?? 'Recurso no encontrado';
        } else if (error.error?.message) {
            message = error.error.message;
        }

        console.error('[UsuarioService] Error:', error);
        return throwError(() => new Error(message));
    }
}