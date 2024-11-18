import Swal from 'sweetalert2';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MDBModalService } from 'angular-bootstrap-md';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SiniestroService } from 'src/app/components/services/siniestro.service';

@Component({
  selector: 'app-add-siniestro',
  templateUrl: './add-siniestro.component.html',
  styleUrls: ['./add-siniestro.component.scss'],
  providers:[SiniestroService]
})
export class AddSiniestroComponent implements OnInit {
  formAdd = this.fb.group({
    tipo_siniestro_id:['1',Validators.required],
    clave_referencia: ['REF005', Validators.required],
    comuna_id: ['1', Validators.required],
    bombero_id: ['1', Validators.required],
    usuario_id:['1', Validators.required],
    fecha: ['', Validators.required],
    perdidas_materiales: ['', Validators.required],
    implementos_utilizados: ['', Validators.required],

    afectados: ['', [Validators.required]],  // Solo números
    implementos: ['', Validators.required],
    tipoSiniestro: ['', Validators.required],
    descripcion: ['', Validators.required]
  });
  dataEjecutivo: any;
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
    ,private _siniestroService: SiniestroService
  ) {
    this.dataUser();
  }

  ngOnInit(): void {

  }

  dataUser() {
    // this._dataService.currentMessage.subscribe(value => {
    //   this.dataEjecutivo = value;
    // })

  }

  saveData(){
    const params = this.formAdd.value
    console.log('valor',params)
    this._siniestroService.addSiniestro(params).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'Siniestro Creado correctamente',
        });  
      
        this.formAdd.reset();

 
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un problema, intente más tarde',
        });
      }
    );
  }



}