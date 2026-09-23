import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from '../../../../environments/environment'; 

import {
  HistorialIncidente,
  CrearHistorialIncidenteDTO,
  ActualizarHistorialIncidenteDTO,
  RespuestaAPI
} from "../models/historial-incidente.model";

@Injectable({
  providedIn: "root"
})
export class HistorialService {

  private apiUrl = `${environment.apiUrl}/api/historial-incidentes`;

  constructor(private http: HttpClient) {}

  // Obtiene todos los registros del historial
  getAll(): Observable<HistorialIncidente[]> {
    return this.http
      .get<RespuestaAPI<HistorialIncidente[]>>(this.apiUrl)
      .pipe(
        map((response) => response.data ?? [])
      );
  }

  // Obtiene un registro del historial por su ID
  getById(id: number): Observable<HistorialIncidente | null> {
    return this.http
      .get<RespuestaAPI<HistorialIncidente>>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => response.data ?? null)
      );
  }

  // Crea un nuevo registro en el historial
  create(
    data: CrearHistorialIncidenteDTO
  ): Observable<RespuestaAPI<HistorialIncidente>> {
    return this.http.post<RespuestaAPI<HistorialIncidente>>(
      this.apiUrl,
      data
    );
  }

  // Actualiza un registro existente del historial
  update(
    id: number,
    data: ActualizarHistorialIncidenteDTO
  ): Observable<RespuestaAPI<HistorialIncidente>> {
    return this.http.put<RespuestaAPI<HistorialIncidente>>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // Elimina un registro del historial
  delete(id: number): Observable<RespuestaAPI<void>> {
    return this.http.delete<RespuestaAPI<void>>(
      `${this.apiUrl}/${id}`
    );
  }
}