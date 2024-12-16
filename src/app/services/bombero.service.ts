import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BomberoService {
  private apiUrl = 'http://localhost:3000/bombero'; // URL base de la API

  constructor(private http: HttpClient) {}

  // Método para obtener información del bombero
  getBomberoInfo(rut: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/info`, { rut });
  }
}
