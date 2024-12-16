import { Component } from '@angular/core';
import { PythonService } from '../../services/python.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-proyecciones',
  templateUrl: './proyecciones.component.html',
  styleUrls: ['./proyecciones.component.scss'],
})
export class ProyeccionesComponent {
  images: string[] = []; // Almacena las rutas completas de las imágenes
  currentIndex: number = 0; // Índice de la imagen actual
  loading: boolean = false;

  constructor(private pythonService: PythonService) {}

  runPythonScript(): void {
    this.loading = true; // Activar el indicador de carga

    // Simular un retraso de 3 segundos antes de cargar las imágenes
    setTimeout(() => {
      this.pythonService.runPython().subscribe({
        next: (response) => {
          const baseUrl = environment.apiUrl;
          this.images = response.images.map((image: string) => `${baseUrl}${image}`);
          this.currentIndex = 0; // Reiniciar índice
          this.loading = false; // Desactivar el indicador de carga
        },
        error: (err) => {
          console.error('Error al ejecutar el script de Python:', err);
          this.loading = false; // Desactivar el indicador de carga en caso de error
        },
      });
    }, 3000); // Mantener el indicador de carga activo durante 3 segundos
  }

  // Navegar a la imagen anterior
  prevImage(): void {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  // Navegar a la siguiente imagen
  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }
}
