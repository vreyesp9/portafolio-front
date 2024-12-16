import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as bootstrap from 'bootstrap'; // Importar explícitamente Bootstrap
import jwtDecode from 'jwt-decode'; // Importamos la librería para decodificar JWT

import { BomberoService } from '../../services/bombero.service'; // Servicio para obtener datos

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})
export class PrincipalComponent implements OnInit, AfterViewInit {
  specialPage: boolean = false;
  greeting: string = ''; // Saludo dinámico (días, tardes, noches)
  nombre: string = ''; // Nombre del bombero
  apellido: string = ''; // Apellido del bombero
  cargo: string = ''; // Cargo del bombero

  constructor(private bomberoService: BomberoService) {}

  ngOnInit(): void {
    this.setGreeting();
    this.loadBomberoInfo();
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

// Método para establecer el saludo dinámico según la hora del día y el horario de Santiago de Chile
private setGreeting(): void {
  // Crear una fecha actual ajustada al huso horario de Santiago de Chile
  const nowInChile = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'America/Santiago' })
  );

  const hour = nowInChile.getHours();
  if (hour < 12) {
    this.greeting = 'días';
  } else if (hour < 18) {
    this.greeting = 'tardes';
  } else {
    this.greeting = 'noches';
  }
}


private loadBomberoInfo(): void {
  const token = sessionStorage.getItem('identity-portafolio'); // Obtiene el token almacenado
  if (!token) {
    console.error('Token no encontrado en sessionStorage');
    return;
  }

  try {
    const decodedToken: any = jwtDecode(token); // Decodifica el token
    console.log('Token decodificado:', decodedToken); // Confirma que los datos son correctos
    const rut = decodedToken.rut; // Extrae el RUT del token

    console.log('RUT obtenido del token:', rut);

    // Llamada al servicio para obtener información del bombero
    this.bomberoService.getBomberoInfo(rut).subscribe(
      (response) => {
        if (response.success) {
          console.log('Información del bombero:', response.data); // Confirmar respuesta del backend
          this.nombre = response.data.nombres;
          this.apellido = response.data.apellidos;
          this.cargo = response.data.cargo;
        } else {
          console.error('Error al cargar la información del bombero:', response.msg);
        }
      },
      (error) => {
        console.error('Error en la solicitud al backend:', error);
      }
    );
  } catch (error) {
    console.error('Error al decodificar el token:', error);
  }
}


  // Método para inicializar el carrusel
  private initializeCarousel(): void {
    const myCarouselElement = document.querySelector('#mainCarousel'); // Selector del carrusel
    if (myCarouselElement) {
      new bootstrap.Carousel(myCarouselElement, {
        interval: 2800, // Cambiar automáticamente cada 3 segundos
        ride: 'carousel'
      });
    } else {
      console.error('El elemento del carrusel no fue encontrado');
    }
  }
}
