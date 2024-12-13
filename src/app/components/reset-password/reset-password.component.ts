import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../services/email.service'; // Importar el servicio
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  step = 1; // Controla el paso actual (1: ingresar correo, 2: verificar código, 3: nueva contraseña)
  emailForm: FormGroup;
  codeForm: FormGroup;
  passwordForm: FormGroup;
  email!: string; // Guarda el correo ingresado

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService, // Inyectar el servicio
    private router: Router
  ) {
    // Formulario para ingresar el correo electrónico
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Formulario para ingresar el código de verificación
    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });

    // Formulario para ingresar la nueva contraseña
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  /**
   * Paso 1: Enviar correo electrónico con el código de verificación
   */
  sendEmail() {
    this.email = this.emailForm.value.email;

    this.emailService.sendResetCode(this.email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Código enviado',
          text: `Se ha enviado un código de verificación al correo: ${this.email}.`,
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.step = 2; // Avanzar al paso 2
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el código. Por favor, verifica el correo ingresado o inténtalo más tarde.',
        });
      },
    });
  }

  /**
   * Paso 2: Verificar el código de verificación ingresado
   */
  verifyCode() {
    const code = this.codeForm.value.code;

    this.emailService.verifyResetCode(this.email, code).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Código verificado',
          text: 'El código ingresado es correcto.',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.step = 3; // Avanzar al paso 3
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Código incorrecto',
          text: 'El código ingresado no es válido. Inténtalo nuevamente.',
        });
      },
    });
  }

  /**
   * Paso 3: Cambiar la contraseña del usuario
   */
  resetPassword() {
    const newPassword = this.passwordForm.value.newPassword;
    const confirmPassword = this.passwordForm.value.confirmPassword;

    // Verificar si las contraseñas coinciden
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden. Verifica e inténtalo de nuevo.',
      });
      return;
    }

    // Llamar al backend para actualizar la contraseña
    this.emailService.resetPassword(this.email, newPassword).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña ha sido actualizada correctamente.',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          this.router.navigate(['/']); // Redirigir al login
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la contraseña. Por favor, inténtalo más tarde.',
        });
      },
    });
  }
}
