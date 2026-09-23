import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Refugio, CrearRefugioDTO, ActualizarRefugioDTO } from "../models/refugio.model";
import { environment } from '../../../../environments/environment'; 

// Marca la clase como inyectable en toda la aplicacion
@Injectable({
  providedIn: "root"
})
export class RefugioService {
  // URL base de la API del backend
    private apiUrl = `${environment.apiUrl}/api/refugios`;

  // Inyecta el cliente HTTP para hacer peticiones
  constructor(private http: HttpClient) {}

  // Obtiene la lista de todos los refugios activos
  getAll(): Observable<Refugio[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => {
        if (Array.isArray(response)) {
          return response;
        }
        if (response && response.data) {
          return response.data;
        }
        return [];
      })
    );
  }

  // Obtiene un refugio especifico por su ID
  getById(id: number): Observable<Refugio> {
    return this.http.get<Refugio>(`${this.apiUrl}/${id}`);
  }

  // Crea un nuevo refugio en la base de datos
  create(data: CrearRefugioDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualiza un refugio existente por su ID
  update(id: number, data: ActualizarRefugioDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Elimina un refugio (soft delete) por su ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}