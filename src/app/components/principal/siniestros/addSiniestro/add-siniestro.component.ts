import Swal from 'sweetalert2';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MDBModalService } from 'angular-bootstrap-md';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-siniestro',
  templateUrl: './add-siniestro.component.html',
  styleUrls: ['./add-siniestro.component.scss'],
})
export class AddSiniestroComponent implements OnInit {
  formAdd = new FormGroup({
    titulo: new FormControl(''),
    descripcion: new FormControl(''),
    status: new FormControl(''),

  });
  dataEjecutivo: any;
  constructor(
    private dialog: MatDialog
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

  createTicket() {
    const params = this.formAdd.value
    // this._tickets.addTickets(params, this.dataEjecutivo).subscribe(
    //   response => {
    //     const dataTicket = response['data']
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Ticket Creado',
    //       text: 'Ticket Creado Correctamente ',
    //     });

    //     this.dialog.closeAll()

    //   },
    //   error => {
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'Error',
    //       text: 'Ocurrio un problema, intente mas tarde',
    //     });
    //   }
    // )





  }

}