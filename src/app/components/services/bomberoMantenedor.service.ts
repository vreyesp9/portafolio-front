import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BomberoService {
  private baseUrl = 'http://localhost:3000/api/mantenedor2'; // Cambia la URL base según sea necesario

  constructor(private http: HttpClient) {}

  // Obtener la lista de todos los bomberos
  getBomberos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bomberosL`);
  }

  // Crear un nuevo bombero
  createBombero(bombero: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/bomberosC`, bombero);
  }

  // Actualizar un bombero existente
  updateBombero(bombero: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/bomberosA`, bombero);
  }

  // Eliminar un bombero
  deleteBombero(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/bomberos/${id}`);
  }
}
