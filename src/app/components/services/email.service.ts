import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // Hace que este servicio esté disponible en toda la aplicación
})
export class EmailService {
  private apiUrl = 'http://localhost:3000/api/email'; // Cambia la URL al endpoint de tu backend

  constructor(private http: HttpClient) {}

  // Enviar código de verificación al correo
  sendResetCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-reset-code`, { email });
  }

  // Verificar el código ingresado
  verifyResetCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-reset-code`, { email, code });
  }

  // Cambiar la contraseña del usuario
  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, newPassword });
  }
}
