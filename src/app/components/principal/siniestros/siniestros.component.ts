import Swal from 'sweetalert2';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MDBModalService } from 'angular-bootstrap-md';
import { AddSiniestroComponent } from './addSiniestro/add-siniestro.component';
import { SiniestroService } from '../../services/siniestro.service';

@Component({
  selector: 'app-siniestros',
  templateUrl: './siniestros.component.html',
  styleUrls: ['./siniestros.component.scss'],
  providers:[SiniestroService]
})
export class SiniestrosComponent implements OnInit {
  @ViewChild('exampleModal') exampleModal: TemplateRef<any>;
  dataTicket: string[] = ['nombre', 'rut', 'banco', 'tipocuenta', 'monto'];
  displayedColumns: string[] = ['nombre', 'rut', 'banco', 'tipocuenta', 'monto'];
  historial = [];
  dataSource: any[] = []; // Asegúrate de que sea un array vacío inicialmente
  valDataSiniestro;
  datasiniestros;
  modalRef;
  dataEjecutivo: any;

  paginatedData;
  currentPage: number = 1; // Página actual
  pageSize: number = 5; // Tamaño de la página
  totalItems: number = 0

  constructor(private dialog: MatDialog,private _siniestroService: SiniestroService) {
    this.getSiniestros()

  }

  ngOnInit(): void {

  }
  totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  

  // Cambiar la página actual
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) { // Asegúrate de que la página esté dentro de los límites
      this.currentPage = page;
      this.loadData(); // Carga los datos para la nueva página
    }
  }
  
  loadData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
  
    // Filtra los datos según la página actual y el tamaño de la página
    this.paginatedData = this.dataSource.slice(startIndex, endIndex);
    this.totalItems = this.dataSource.length; // Para saber cuántos registros hay en total
  }
  
  // Obtener solo los datos correspondientes a la página actual



  deleteSiniestro(id) : void{
console.log('Valor a eliminar ID',id)
try {
  
  this._siniestroService.deleteSiniestro(parseInt(id)).subscribe(
    response => {
 
      Swal.fire({
        icon: 'success',
        title: 'Correcto',
        text: 'Registro eliminado',
      });
      this.getSiniestros();
    },
    error => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un problema, intente más tarde',
      });
    }
  );

} catch (error) {
  
}

  }
  getSiniestros(): void {
    this._siniestroService.getSiniestro().subscribe(
      response => {
        this.dataSource = response.body; // Asumiendo que los datos vienen en el cuerpo de la respuesta
        console.log('Valor de resp', this.dataSource);
        this.totalItems = this.dataSource.length;
        this.loadData(); // Llama a loadData después de que los datos estén cargados
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
  changeValue(value2) {


    this._siniestroService.updateSiniestro(value2).subscribe(
      response => {
        const prueba = response['data']
        value2.show = false;
        Swal.fire({
          icon: 'success',
          title: 'Ticket Actualizado',
          text: 'Ticket actualizado Correctamente ',
        });
      },
      error => {
        this.getSiniestros()
        value2.show = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un problema, intente mas tarde',
        });
      }
    )


  }
  showAddSiniestroModal(): void {
    let dialogRef = this.dialog.open(AddSiniestroComponent, {
      height: 'fit-content',
      width: '100%',
      maxWidth: '900px',
      disableClose: false,
      position: { top: '10%'} // Ajusta `top` y déjalo centrado horizontalmente
    });
    dialogRef.afterClosed().subscribe(result => {
       this.getSiniestros();

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