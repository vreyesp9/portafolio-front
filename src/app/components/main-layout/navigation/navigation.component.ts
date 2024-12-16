import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Importa el servicio de autenticación
import jwtDecode from 'jwt-decode'; // Para decodificar el token JWT

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: ElementRef;

  clicked: boolean;
  isCollapsed = false;
  isAdmin: boolean = false; // Controla si el usuario puede ver la sección "admin"

  constructor(
    private _router: Router,
    private authService: AuthService // Inyectamos el AuthService
  ) {
    this.clicked = this.clicked === undefined ? false : true;
  }
  

  ngOnInit(): void {
    // Validar y decodificar el token al cargar el componente
    const token = sessionStorage.getItem('identity-portafolio');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token); // Decodifica el token
        console.log('Token decodificado en Navigation:', decodedToken);

        // Verifica si el usuario es administrador
        if (decodedToken.cargo_id === 1) { // Si el cargo_id es 1 (Capitán)
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        // Limpia la sesión y redirige si el token no es válido
        sessionStorage.removeItem('identity-portafolio');
        this._router.navigate(['/']);
      }
    } else {
      console.error('Token no encontrado. Redirigiendo al login...');
      this._router.navigate(['/']);
    }
  }

  setClicked(val: boolean): void {
    this.clicked = val;
  }

  logout(): void {
    // Limpia el almacenamiento de sesión y redirige al login
    sessionStorage.removeItem('identity-portafolio');
    this._router.navigate(['/']);
  }

  private checkAdminAccess(): void {
    const token = sessionStorage.getItem('identity-portafolio'); // Obtiene el token almacenado
    if (token) {
      const decodedToken: any = jwtDecode(token);
      console.log("Token decodificado en Navigation:", decodedToken);
  
      if (decodedToken.cargo_id === 1) { // Si el cargo_id es 1 (Capitán)
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    } else {
      this.isAdmin = false;
    }
  }
     // Método para alternar el estado del sidebar
     toggleSidebar(): void {
      this.isCollapsed = !this.isCollapsed;
    }
  
}
