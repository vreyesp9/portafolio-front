import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioMantenedorService { // Renombrar para que refleje su propósito
  private baseUrl = 'http://localhost:3000/api/mantenedor'; // URL base correcta

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usuariosL`);
  }

  // Crear un usuario
  createUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuariosC`, usuario);
  }

  // Actualizar un usuario existente
  updateUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuariosA`, usuario);
  }

  // Eliminar un usuario
  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`);
  }
}
