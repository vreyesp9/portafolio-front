import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniaService {
  private baseUrl = 'http://localhost:3000/api/companias'; // Cambia según tu configuración

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de compañías
  getCompanias(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Listar`);
  }
}
  