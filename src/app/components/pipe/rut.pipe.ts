import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rut'
})
export class RutPipe implements PipeTransform {

  transform(value: string): boolean {
    // Eliminar puntos del RUT
    const sanitizedRut = value.replace(/\./g, ''); // Remueve los puntos

    // Validar el formato del RUT
    if (!this.validateRutFormat(sanitizedRut)) {
      return false; // Retorna false si el formato es inválido
    }
    
    // Validar la validez del RUT
    return this.validateRut(sanitizedRut);
  }

  private validateRutFormat(rut: string): boolean {
    // El RUT debe tener entre 8 y 9 caracteres y terminar con un dígito o 'K'
    const rutPattern = /^\d{7,8}-[\dkK]$/;
    return rutPattern.test(rut);
  }

  private validateRut(rut: string): boolean {
    const [numberPart, verifierDigit] = rut.split('-');
    let sum = 0;
    let factor = 2;

    for (let i = numberPart.length - 1; i >= 0; i--) {
      sum += parseInt(numberPart.charAt(i), 10) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }

    const calculatedVerifierDigit = 11 - (sum % 11);
    const finalVerifierDigit = calculatedVerifierDigit === 11 ? '0' : (calculatedVerifierDigit === 10 ? 'K' : calculatedVerifierDigit.toString());

    return finalVerifierDigit === verifierDigit.toUpperCase();
  }
}
