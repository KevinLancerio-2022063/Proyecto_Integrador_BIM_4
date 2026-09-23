import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import {
  AsignacionPersonal,
  CrearAsignacionPersonalDTO,
  RespuestaAsignacionPersonalAPI
} from "../models/asignacion-personal.model";
import { environment } from '../../../../environments/environment'; 

// Marca la clase como inyectable en toda la aplicación
@Injectable({
  providedIn: "root"
})
export class AsignacionPersonalService {
  // URL base de la API del backend
  private apiUrl = `${environment.apiUrl}/api/asignacion_personal`;

  // Inyecta el cliente HTTP para hacer peticiones
  constructor(private http: HttpClient) {}

  // Obtiene la lista de todas las asignaciones de personal
  getAll(): Observable<AsignacionPersonal[]> {
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

  // Obtiene una asignación de personal específica por su ID
  getById(id: number): Observable<AsignacionPersonal> {
    return this.http.get<AsignacionPersonal>(`${this.apiUrl}/${id}`);
  }

  // Crea una nueva asignación de personal en la base de datos
  create(data: CrearAsignacionPersonalDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Actualiza una asignación de personal existente por su ID
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Elimina una asignación de personal por su ID
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
