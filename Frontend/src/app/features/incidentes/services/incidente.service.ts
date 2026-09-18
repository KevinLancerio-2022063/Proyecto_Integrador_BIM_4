import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Incidente, CrearIncidenteDTO, ActualizarIncidenteDTO, RespuestaAPI } from "../models/incidente.model";

@Injectable({
  providedIn: "root"
})
export class IncidenteService {
  private apiUrl = "http://localhost:3000/api/incidentes";

  constructor(private http: HttpClient) {}

  // Obtiene la lista de todos los incidentes activos
  getAll(): Observable<Incidente[]> {
    return this.http.get<RespuestaAPI<Incidente[]>>(this.apiUrl).pipe(
      map((response) => response.data ?? [])
    );
  }

  // Obtiene un incidente específico por su ID
  getById(id: number): Observable<Incidente | null> {
    return this.http.get<RespuestaAPI<Incidente>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => response.data ?? null)
    );
  }

  // Crea un nuevo incidente en la base de datos
  create(data: CrearIncidenteDTO): Observable<RespuestaAPI<Incidente>> {
    return this.http.post<RespuestaAPI<Incidente>>(this.apiUrl, data);
  }

  // Actualiza un incidente existente por su ID
  update(id: number, data: ActualizarIncidenteDTO): Observable<RespuestaAPI<Incidente>> {
    return this.http.put<RespuestaAPI<Incidente>>(`${this.apiUrl}/${id}`, data);
  }

  // Elimina un incidente por su ID
  delete(id: number): Observable<RespuestaAPI<void>> {
    return this.http.delete<RespuestaAPI<void>>(`${this.apiUrl}/${id}`);
  }
}