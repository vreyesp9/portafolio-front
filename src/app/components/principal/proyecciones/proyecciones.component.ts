import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { RutPipe } from '../../pipe/rut.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proyecciones',
  templateUrl: './proyecciones.component.html',
  styleUrls: ['./proyecciones.component.scss'] // Asegúrate de tener este archivo o modificar según sea necesario
})
export class ProyeccionesComponent implements OnInit {

  constructor(private fb: FormBuilder,private _router: Router,
  ) {
    
  
  }

  ngOnInit(): void {
  }
 
}
