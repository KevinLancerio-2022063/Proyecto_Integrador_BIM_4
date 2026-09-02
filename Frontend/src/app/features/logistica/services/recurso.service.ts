import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Recurso, CrearRecursoDTO, RespuestaAPI } from "../models/recurso.model";

// Marca la clase como inyectable en toda la aplicación
@Injectable({
  providedIn: "root"
})
export class RecursoService {
  // URL base de la API del backend
  private apiUrl = "http://localhost:3000/api/recursos";

  // Inyecta el cliente HTTP para hacer peticiones
  constructor(private http: HttpClient) {}

  // Obtiene la lista de todos los recursos activos
  getAll(): Observable<Recurso[]> {
    // Indicamos que la respuesta es de tipo RespuestaAPI que contiene un array de Recurso
    return this.http.get<RespuestaAPI<Recurso[]>>(this.apiUrl).pipe(
      // Extraemos solo el array que viene en la propiedad 'data'
      map(response => response.data || [])
    );
  }

  // Obtiene un recurso específico por su ID
  getById(id: number): Observable<Recurso> {
    return this.http.get<Recurso>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuevo recurso en la base de datos
  create(data: CrearRecursoDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualiza un recurso existente por su ID
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Elimina un recurso (soft delete) por su ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}