import { Component, OnInit } from '@angular/core';
import { BomberoService } from '../../services/bomberoMantenedor.service';
import { CargoService } from '../../services/cargo.service';
import { CompaniaService } from '../../services/compania.service';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-matenedor-bombero',
  templateUrl: './matenedor-bombero.component.html',
  styleUrls: ['./matenedor-bombero.component.scss']
})
export class MatenedorBomberoComponent implements OnInit {
  bomberos: any[] = [];
  bomberosFiltrados: any[] = [];
  bomberosPaginados: any[] = [];
  bomberoSeleccionado: any = {};
  cargos: any[] = []; // Lista de cargos disponibles
  companias: any[] = []; // Lista de compañías disponibles

  paginaActual: number = 1;
  elementosPorPagina: number = 8;
  totalPaginas: number = 0;
  filtroTexto: string = '';
  filtroSeleccionado: string = 'Sin filtro';
  filtrosDisponibles = ['Sin filtro', 'Nombre', 'Apellido', 'RUT', 'Cargo', 'Compañía'];

  constructor(
    private bomberoService: BomberoService,
    private cargoService: CargoService,
    private companiaService: CompaniaService
  ) {}

  ngOnInit(): void {
    this.cargarCargos();
    this.cargarCompanias();
    this.cargarBomberos();
  }

  // Cargar lista de bomberos desde el servicio
  cargarBomberos(): void {
    this.bomberoService.getBomberos().subscribe(
      (response) => {
        if (response.success) {
          this.bomberos = response.data;
  
          // Enriquecer datos
          this.bomberos.forEach((bombero) => {
            bombero.nombre_cargo =
              this.cargos.find((c) => c.id === bombero.cargo_id)?.nombre_cargo || 'Sin asignar';
            bombero.nombre_compania =
              this.companias.find((c) => c.id === bombero.compania_id)?.nombre_compania || 'Sin asignar';
          });
  
          this.bomberosFiltrados = [...this.bomberos];
          this.actualizarPaginador();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los bomberos.',
          });
        }
      },
      (error) => {
        console.error('Error al cargar los bomberos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al conectar con el servidor.',
        });
      }
    );
  }
  

  // Cargar lista de cargos
  cargarCargos(): void {
    this.cargoService.getCargos().subscribe(
      (response) => {
        if (response.success) {
          this.cargos = response.data;
        }
      },
      (error) => {
        console.error('Error al cargar los cargos:', error);
      }
    );
  }

  // Cargar lista de compañías
  cargarCompanias(): void {
    this.companiaService.getCompanias().subscribe(
      (response) => {
        if (response.success) {
          this.companias = response.data;
        }
      },
      (error) => {
        console.error('Error al cargar las compañías:', error);
      }
    );
  }

 // Aplicar filtro a la lista de bomberos
 aplicarFiltro(): void {
  if (this.filtroSeleccionado === 'Sin filtro' || !this.filtroTexto.trim()) {
    this.bomberosFiltrados = [...this.bomberos];
  } else {
    this.bomberosFiltrados = this.bomberos.filter((bombero) => {
      if (this.filtroSeleccionado === 'Nombre') {
        return bombero.nombres.toLowerCase().includes(this.filtroTexto.toLowerCase());
      } else if (this.filtroSeleccionado === 'Apellido') {
        return bombero.apellidos.toLowerCase().includes(this.filtroTexto.toLowerCase());
      } else if (this.filtroSeleccionado === 'RUT') {
        return bombero.rut.toLowerCase().includes(this.filtroTexto.toLowerCase());
      } else if (this.filtroSeleccionado === 'Cargo') {
        return bombero.nombre_cargo.toLowerCase().includes(this.filtroTexto.toLowerCase());
      } else if (this.filtroSeleccionado === 'Compañía') {
        return bombero.nombre_compania.toLowerCase().includes(this.filtroTexto.toLowerCase());
      }
      return false;
    });
  }
  this.paginaActual = 1;
  this.actualizarPaginador();
}

  // Actualizar paginación
  actualizarPaginador(): void {
    this.totalPaginas = Math.ceil(this.bomberosFiltrados.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.bomberosPaginados = this.bomberosFiltrados.slice(inicio, fin);
  }

  // Cambiar página en la paginación
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarPaginador();
    }
  }

  // Abrir modal para agregar/editar bomberos
  openModal(bombero: any = null): void {
    if (bombero) {
      this.bomberoSeleccionado = { ...bombero }; // Clonar el bombero seleccionado
    } else {
      // Crear un nuevo objeto vacío para agregar
      this.bomberoSeleccionado = { 
        id: null, 
        rut: '', 
        nombres: '', 
        apellidos: '', 
        edad: null, 
        cargo_id: null, 
        compania_id: null 
      };
    }
  
    const modalElement = document.getElementById('bomberoModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement); // Crear instancia del modal
      modalInstance.show();
    } else {
      console.error('No se encontró el elemento modal');
    }
  }


  // Guardar cambios (crear o actualizar bombero)
  saveChanges(): void {
    // Validaciones antes de guardar
    if (
      !this.bomberoSeleccionado.rut ||
      !this.bomberoSeleccionado.nombres ||
      !this.bomberoSeleccionado.apellidos ||
      !this.bomberoSeleccionado.edad ||
      !this.bomberoSeleccionado.cargo_id ||
      !this.bomberoSeleccionado.compania_id
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios.',
      });
      return;
    }
  
    if (this.bomberoSeleccionado.id) {
      // Actualizar bombero
      this.bomberoService.updateBombero(this.bomberoSeleccionado).subscribe(
        (response) => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado correctamente',
              text: 'El bombero se actualizó exitosamente.',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.cargarBomberos(); // Recargar lista
              this.cerrarModal();
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'Hubo un error al actualizar el bombero. Por favor, inténtalo de nuevo.',
          });
          console.error('Error al actualizar bombero:', error);
        }
      );
    } else {
      // Crear bombero
      this.bomberoService.createBombero(this.bomberoSeleccionado).subscribe(
        (response) => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Creado correctamente',
              text: 'El bombero se creó exitosamente.',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.cargarBomberos(); // Recargar lista
              this.cerrarModal();
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al crear',
            text: 'Hubo un error al crear el bombero. Por favor, inténtalo de nuevo.',
          });
          console.error('Error al crear bombero:', error);
        }
      );
    }
  }
  


  // Eliminar bombero
  deleteBombero(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bomberoService.deleteBombero(id).subscribe(
          (response) => {
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El bombero se eliminó correctamente.',
              }).then(() => {
                this.cargarBomberos(); // Recargar lista
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'Hubo un error al eliminar el bombero. Por favor, inténtalo de nuevo.',
            });
            console.error('Error al eliminar bombero:', error);
          }
        );
      }
    });
  }
  
  // Cerrar modal
  cerrarModal(): void {
    const modalElement = document.getElementById('bomberoModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
