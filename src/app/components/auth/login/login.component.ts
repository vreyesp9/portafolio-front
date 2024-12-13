import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RutPipe } from '../../pipe/rut.pipe';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import jwtDecode from 'jwt-decode'; // Importamos la librería para decodificar el token JWT

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // Asegúrate de tener este archivo o modificar según sea necesario
  providers: [UsuarioService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _usuarioService: UsuarioService
  ) {
    // Inicializa el formulario
    this.loginForm = this.fb.group({
      rut: ['', [Validators.required]], // Valida que el RUT sea obligatorio
      password: ['', [Validators.required]] // Valida que la contraseña sea obligatoria
    });
  }

  ngOnInit(): void {}

  onRutInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = input.value.replace(/[^0-9kK]/g, '').toUpperCase(); // Sanitiza la entrada eliminando caracteres no válidos
    // Aplica el formato
    const formattedValue = this.formatRut(sanitizedValue);
    // Validar el RUT
    const rutPipe = new RutPipe();
    this.isValid = rutPipe.transform(formattedValue); // Verifica la validez con el formato aplicado
    // Solo actualizar si el nuevo valor es diferente
    if (formattedValue !== input.value) {
      input.value = formattedValue; // Actualiza el input para mostrar el valor formateado
      this.loginForm.get('rut')?.setValue(formattedValue); // Actualiza el valor en el formulario
    }
    // Mensaje de error o realizar alguna acción si el RUT no es válido
    if (!this.isValid && formattedValue) {
      console.log('RUT inválido:', formattedValue);
    }
  }

  // Método para formatear el RUT
  private formatRut(value: string): string {
    // Si el RUT está vacío o es menor a 8 caracteres, retorna el valor original
    if (value.length < 8) {
      return value;
    }
    // Añade los puntos y el guión según el formato chileno
    const rut = value.slice(0, -1);
    const dv = value.slice(-1).toUpperCase(); // Dígito verificador
    const rutWithDots = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Añade puntos
    return `${rutWithDots}-${dv}`; // Devuelve el RUT formateado
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      this._usuarioService.login(formValues).subscribe(
        (response) => {
          if (response.success) {
            const token = response.data.token;
  
            // Limpia cualquier token almacenado previamente
            sessionStorage.removeItem('identity-portafolio');
  
            // Almacena el nuevo token
            sessionStorage.setItem('identity-portafolio', token);
  
            // Decodifica el token para confirmar los datos
            const decodedToken: any = jwtDecode(token);
            console.log('Token decodificado:', decodedToken);
  
            // Verifica el cargo_id, si es necesario
            console.log('Cargo ID:', decodedToken.cargo_id);
  
            // Redirige al home
            this._router.navigate(['/home']);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Usuario o contraseña incorrectos',
            });
          }
        },
        (error) => {
          console.error('Error al iniciar sesión:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al iniciar sesión. Intenta nuevamente.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos',
      });
    }
  }
  
  
}  