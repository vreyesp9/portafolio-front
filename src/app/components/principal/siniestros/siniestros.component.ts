import Swal from 'sweetalert2';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MDBModalService } from 'angular-bootstrap-md';
import { AddSiniestroComponent } from './addSiniestro/add-siniestro.component';

@Component({
  selector: 'app-siniestros',
  templateUrl: './siniestros.component.html',
  styleUrls: ['./siniestros.component.scss'],
})
export class SiniestrosComponent implements OnInit {
  @ViewChild('exampleModal') exampleModal: TemplateRef<any>;
  dataTicket: string[] = ['nombre', 'rut', 'banco', 'tipocuenta', 'monto'];
  displayedColumns: string[] = ['nombre', 'rut', 'banco', 'tipocuenta', 'monto'];
  historial = [];
  dataSource = ELEMENT_DATA;
  datasiniestros;
  modalRef;
  dataEjecutivo: any;
  constructor(private dialog: MatDialog) {
 
  }

  ngOnInit(): void {
    console.log('Data Source ', this.dataSource)
  }

  showAddTicketModal(): void {
    let dialogRef = this.dialog.open(AddSiniestroComponent, {
      height: 'fit-content',
      width: '100%',
      maxWidth: '900px',
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(result => {
      // this.getTickets();

    });
  }}
export interface PeriodicElement {
  id: number;
  fecha: string;
  perdidasMateriales: string;
  afectados: number;
  implementos: string;
  tipoSiniestro: string;
  descripcion: string;
 show: boolean;

}




const ELEMENT_DATA: PeriodicElement[] = [

    {
      id: 1,
      fecha: "2024-09-01",
      perdidasMateriales: "$50,000",
      afectados: 2,
      implementos: "Extintores, Mangueras",
      tipoSiniestro: "Incendio Estructural",
      descripcion: "Incendio en un edificio de oficinas causado por un cortocircuito.",
      show:false
    },
    {
      id: 2,
      fecha: "2024-09-10",
      perdidasMateriales: "$120,000",
      afectados: 0,
      implementos: "Hidrantes, Extintores",
      tipoSiniestro: "Incendio Forestal",
      descripcion: "Fuego descontrolado en una área rural, afectando varias hectáreas."
      ,
      show:false
    },
    {
      id: 3,
      fecha: "2024-09-15",
      perdidasMateriales: "$30,000",
      afectados: 1,
      implementos: "Mangueras, Escaleras",
      tipoSiniestro: "Incendio Vehicular",
      descripcion: "Vehículo particular incendiado debido a un fallo en el motor."
      ,
      show:false
    },
    {
      id: 4,
      fecha: "2024-09-20",
      perdidasMateriales: "$75,000",
      afectados: 3,
      implementos: "Extintores, Cuerdas",
      tipoSiniestro: "Incendio en Fábrica",
      descripcion: "Incendio en una fábrica de productos químicos, posible explosión involucrada.",
      show:false
    },
    {
      id: 5,
      fecha: "2024-09-25",
      perdidasMateriales: "$200,000",
      afectados: 5,
      implementos: "Extintores, Hidrantes",
      tipoSiniestro: "Incendio en Almacén",
      descripcion: "Incendio de grandes proporciones en un almacén de materiales inflamables.",
      show:false
    }
  
  
];