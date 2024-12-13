import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiniestroService {
  private apiUrl = 'http://localhost:3000/siniestro';

  constructor(private http: HttpClient) {}

  getSiniestro(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getSiniestros`);
  }

  addSiniestro(siniestro: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/addSiniestro`, siniestro);
  }

  updateSiniestro(siniestro: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateSiniestro`, siniestro);
  }

  deleteSiniestro(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteSiniestro/${id}`);
  }

  getTiposSiniestro(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getTiposSiniestro`);
  }
  
  getComunas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getComunas`);
  }
  
  getBomberos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getBomberos`);
  }
  
  getUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUsuarios`);
  }
  
  
}
