import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // Cambia esto si tu backend usa otro puerto

  constructor(private http: HttpClient) {}

  login(credentials: { rut: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuario/login`, credentials).pipe(
      tap((response: any) => {
        if (response.success) {
          const user = response.data.user;
          localStorage.setItem('currentUser', JSON.stringify(user)); // Guardar el usuario en localStorage
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser'); // Eliminar el usuario del almacenamiento local
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }
}
