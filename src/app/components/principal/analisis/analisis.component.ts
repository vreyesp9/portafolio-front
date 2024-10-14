import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { RutPipe } from '../../pipe/rut.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analisis',
  templateUrl: './analisis.component.html',
  styleUrls: ['./analisis.component.scss'] // Asegúrate de tener este archivo o modificar según sea necesario
})
export class AnalisisComponent implements OnInit {

  constructor(private fb: FormBuilder,private _router: Router,
  ) {
  
  }

  ngOnInit(): void {
  }
 
}
