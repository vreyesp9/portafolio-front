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
  cargos: any[] = [];
  companias: any[] = [];
  esEdicion: boolean = false; // Variable para diferenciar entre agregar y editar

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

  cargarBomberos(): void {
    this.bomberoService.getBomberos().subscribe(
      (response) => {
        if (response.success) {
          this.bomberos = response.data;

          // Enriquecer datos con nombres de cargo y compañía
          this.bomberos.forEach((bombero) => {
            bombero.nombre_cargo =
              this.cargos.find((c) => c.id === bombero.cargo_id)?.nombre_cargo || 'Sin asignar';
            bombero.nombre_compania =
              this.companias.find((c) => c.id === bombero.compania_id)?.nombre_compania || 'Sin asignar';
          });

          this.bomberosFiltrados = [...this.bomberos];
          this.actualizarPaginador();
        } else {
          Swal.fire('Error', 'No se pudieron cargar los bomberos.', 'error');
        }
      },
      (error) => {
        console.error('Error al cargar los bomberos:', error);
        Swal.fire('Error', 'Hubo un error al conectar con el servidor.', 'error');
      }
    );
  }

  cargarCargos(): void {
    this.cargoService.getCargos().subscribe(
      (response) => {
        if (response.success) {
          this.cargos = response.data;
        }
      },
      (error) => console.error('Error al cargar los cargos:', error)
    );
  }

  cargarCompanias(): void {
    this.companiaService.getCompanias().subscribe(
      (response) => {
        if (response.success) {
          this.companias = response.data;
        }
      },
      (error) => console.error('Error al cargar las compañías:', error)
    );
  }

  aplicarFiltro(): void {
    if (this.filtroSeleccionado === 'Sin filtro' || !this.filtroTexto.trim()) {
      this.bomberosFiltrados = [...this.bomberos];
    } else {
      this.bomberosFiltrados = this.bomberos.filter((bombero) => {
        switch (this.filtroSeleccionado) {
          case 'Nombre':
            return bombero.nombres.toLowerCase().includes(this.filtroTexto.toLowerCase());
          case 'Apellido':
            return bombero.apellidos.toLowerCase().includes(this.filtroTexto.toLowerCase());
          case 'RUT':
            return bombero.rut.toLowerCase().includes(this.filtroTexto.toLowerCase());
          case 'Cargo':
            return bombero.nombre_cargo.toLowerCase().includes(this.filtroTexto.toLowerCase());
          case 'Compañía':
            return bombero.nombre_compania.toLowerCase().includes(this.filtroTexto.toLowerCase());
          default:
            return false;
        }
      });
    }
    this.paginaActual = 1;
    this.actualizarPaginador();
  }

  actualizarPaginador(): void {
    this.totalPaginas = Math.ceil(this.bomberosFiltrados.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.bomberosPaginados = this.bomberosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarPaginador();
    }
  }

  openModal(bombero: any = null): void {
    this.esEdicion = !!bombero; // Determinar si es edición o agregar
    this.bomberoSeleccionado = bombero
      ? { ...bombero }
      : { id: null, rut: '', nombres: '', apellidos: '', edad: null, cargo_id: null, compania_id: null };

    const modalElement = document.getElementById('bomberoModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement);
      modalInstance.show();
    }
  }

  saveChanges(): void {
    if (
      !this.bomberoSeleccionado.rut ||
      !this.bomberoSeleccionado.nombres ||
      !this.bomberoSeleccionado.apellidos ||
      !this.bomberoSeleccionado.edad ||
      !this.bomberoSeleccionado.cargo_id ||
      !this.bomberoSeleccionado.compania_id
    ) {
      Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
      return;
    }

    if (this.esEdicion) {
      this.bomberoService.updateBombero(this.bomberoSeleccionado).subscribe(
        (response) => {
          if (response.success) {
            Swal.fire('Actualizado', 'El bombero se actualizó correctamente.', 'success');
            this.cargarBomberos();
            this.cerrarModal();
          }
        },
        (error) => Swal.fire('Error', 'Hubo un error al actualizar el bombero.', 'error')
      );
    } else {
      this.bomberoService.createBombero(this.bomberoSeleccionado).subscribe(
        (response) => {
          if (response.success) {
            Swal.fire('Creado', 'El bombero se agregó correctamente.', 'success');
            this.cargarBomberos();
            this.cerrarModal();
          }
        },
        (error) => Swal.fire('Error', 'Hubo un error al agregar el bombero.', 'error')
      );
    }
  }

  deleteBombero(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás deshacer esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bomberoService.deleteBombero(id).subscribe(() => {
          Swal.fire('Eliminado', 'El bombero se eliminó correctamente.', 'success');
          this.cargarBomberos();
        });
      }
    });
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('bomberoModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
