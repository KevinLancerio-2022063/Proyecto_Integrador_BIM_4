import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Refugio, CrearRefugioDTO, RespuestaAPI } from "../models/refugio.model";

// Marca la clase como inyectable en toda la aplicación
@Injectable({
  providedIn: "root"
})
export class RefugioService {
  // URL base de la API del backend
  private apiUrl = "http://localhost:3000/api/refugios";

  // Inyecta el cliente HTTP para hacer peticiones
  constructor(private http: HttpClient) {}

  // Obtiene la lista de todos los refugios activos
  getAll(): Observable<Refugio[]> {
    return this.http.get<RespuestaAPI<Refugio[]>>(this.apiUrl).pipe(
      map(response => response.data || [])
    );
  }

  // Obtiene un refugio específico por su ID
  getById(id: number): Observable<Refugio> {
    return this.http.get<RespuestaAPI<Refugio>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data!)
    );
  }

  // Crea un nuevo refugio en la base de datos
  create(data: CrearRefugioDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualiza un refugio existente por su ID
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Elimina un refugio (soft delete) por su ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}