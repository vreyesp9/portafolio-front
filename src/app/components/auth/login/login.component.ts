import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { RutPipe } from '../../pipe/rut.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // Asegúrate de tener este archivo o modificar según sea necesario
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
    isValid: boolean=false;
  constructor(private fb: FormBuilder,private _router: Router,
  ) {
    // Inicializa el formulario
    this.loginForm = this.fb.group({
      rut: ['', [Validators.required]], // Valida que el RUT sea obligatorio
      password: ['', [Validators.required]] // Valida que la contraseña sea obligatoria
    });
  }

  ngOnInit(): void {
  }
  onRutInput(event: Event) {
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
    //Mensaje de error o realizar alguna acción si el RUT no es válido
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
   

    try {
        if (this.loginForm.valid) {
            const formValues = this.loginForm.value;
            console.log('Formulario enviado:', formValues);
            this._router.navigate(['/home']);
          }
      
    } catch (error) {
        
    }
  }
}
