import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { AsignacionRecurso, CrearAsignacionDTO, RespuestaAPI } from "../models/asignacion-recurso.model";

// Marca la clase como inyectable en toda la aplicación
@Injectable({
  providedIn: "root"
})
export class AsignacionRecursoService {
  // URL base de la API del backend
  private apiUrl = "http://localhost:3000/api/asignaciones-recurso";

  // Inyecta el cliente HTTP para hacer peticiones
  constructor(private http: HttpClient) {}

  // Obtiene la lista de todas las asignaciones
  getAll(): Observable<AsignacionRecurso[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => {
        // Si la respuesta es un array directo, lo devolvemos
        if (Array.isArray(response)) {
          return response;
        }
        
        // Si la respuesta es un objeto, intentamos extraer la propiedad 'data'
        if (response && response.data) {
          return response.data;
        }

        // En cualquier otro caso, devolvemos un array vacío
        return [];
      })
    );
  }

  // Obtiene una asignación específica por su ID
  getById(id: number): Observable<AsignacionRecurso> {
    return this.http.get<AsignacionRecurso>(`${this.apiUrl}/${id}`);
  }

  // Crea una nueva asignación en la base de datos
  create(data: CrearAsignacionDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualiza una asignación existente por su ID
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Elimina una asignación (soft delete) por su ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}