import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private baseUrl = 'http://localhost:3000/api/cargos'; // Cambia según tu configuración

  constructor(private http: HttpClient) {}

  // Método para obtener la lista de cargos
  getCargos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Listar`);
  }
}
