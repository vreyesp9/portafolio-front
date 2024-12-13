import { Component, OnInit } from '@angular/core';
import { UsuarioMantenedorService } from '../../services/usuarioMatenedor.service';
import { BomberoService } from '../../services/bomberoMantenedor.service';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-mantenedor-usuario',
  templateUrl: './mantenedor-usuario.component.html',
  styleUrls: ['./mantenedor-usuario.component.scss']
})
export class MantenedorUsuarioComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];
  usuariosPaginados: any[] = [];
  bomberos: any[] = []; // Lista de bomberos para el combobox
  usuarioSeleccionado: any = {};
  passwordVisible: boolean = false; // Controla si la contraseña es visible

  paginaActual: number = 1;
  elementosPorPagina: number = 8;
  totalPaginas: number = 0;
  filtroTexto: string = '';
  filtroSeleccionado: string = 'Sin filtro';
  filtrosDisponibles = ['Sin filtro', 'Nombre', 'Apellido', 'RUT'];

  constructor(
    private usuarioService: UsuarioMantenedorService,
    private bomberoService: BomberoService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarBomberos(); // Cargar la lista de bomberos
  }

  cargarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(
      (response) => {
        if (response.success) {
          this.usuarios = response.data;
          this.usuariosFiltrados = [...this.usuarios];
          this.actualizarPaginador();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar usuarios',
            text: 'No se pudieron cargar los datos de los usuarios.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al conectar',
          text: 'No se pudo conectar con el servidor.',
        });
        console.error('Error al cargar usuarios:', error);
      }
    );
  }
  
  cargarBomberos(): void {
    this.bomberoService.getBomberos().subscribe(
      (response) => {
        if (response.success) {
          this.bomberos = response.data;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al cargar bomberos',
            text: 'No se pudieron cargar los datos de los bomberos.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al conectar',
          text: 'No se pudo conectar con el servidor.',
        });
        console.error('Error al cargar bomberos:', error);
      }
    );
  }
  
  aplicarFiltro(): void {
    if (this.filtroSeleccionado === 'Sin filtro' || !this.filtroTexto.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      this.usuariosFiltrados = this.usuarios.filter((usuario) => {
        if (this.filtroSeleccionado === 'Nombre') {
          return usuario.nombres.toLowerCase().includes(this.filtroTexto.toLowerCase());
        } else if (this.filtroSeleccionado === 'Apellido') {
          return usuario.apellidos.toLowerCase().includes(this.filtroTexto.toLowerCase());
        } else if (this.filtroSeleccionado === 'RUT') {
          return usuario.rut.toLowerCase().includes(this.filtroTexto.toLowerCase());
        }
        return false;
      });
    }
    this.paginaActual = 1;
    this.actualizarPaginador();
  }

  actualizarPaginador(): void {
    this.totalPaginas = Math.ceil(this.usuariosFiltrados.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.usuariosPaginados = this.usuariosFiltrados.slice(inicio, fin);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina > 0 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarPaginador();
    }
  }

  openModal(usuario: any = null): void {
    if (usuario) {
      this.usuarioSeleccionado = { ...usuario }; // Clonar el usuario seleccionado
    } else {
      // Inicializar el formulario para agregar un usuario
      this.usuarioSeleccionado = { id: null, rut: '', email: '', password: '', bombero_id: null };
    }
  
    const modalElement = document.getElementById('usuarioModal');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement); // Crear instancia del modal
      modalInstance.show();
    } else {
      console.error('No se encontró el elemento modal');
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  saveChanges(): void {
    if (
      !this.usuarioSeleccionado.rut ||
      !this.usuarioSeleccionado.email ||
      !this.usuarioSeleccionado.password ||
      !this.usuarioSeleccionado.bombero_id
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Todos los campos son obligatorios.',
      });
      return;
    }
  
    if (this.usuarioSeleccionado.id) {
      // Actualizar usuario
      this.usuarioService.updateUsuario(this.usuarioSeleccionado).subscribe(
        (response) => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado correctamente',
              text: 'El usuario ha sido actualizado exitosamente.',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.cargarUsuarios(); // Recargar usuarios
              this.cerrarModal();
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al actualizar',
            text: 'Hubo un error al intentar actualizar el usuario. Por favor, inténtalo de nuevo.',
          });
          console.error('Error al actualizar usuario:', error);
        }
      );
    } else {
      // Crear usuario
      this.usuarioService.createUsuario(this.usuarioSeleccionado).subscribe(
        (response) => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Creado correctamente',
              text: 'El usuario ha sido creado exitosamente.',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.cargarUsuarios(); // Recargar usuarios
              this.cerrarModal();
            });
          }
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error al crear',
            text: 'Hubo un error al intentar crear el usuario. Por favor, inténtalo de nuevo.',
          });
          console.error('Error al crear usuario:', error);
        }
      );
    }
  }
  deleteUsuario(id: number): void {
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
        this.usuarioService.deleteUsuario(id).subscribe(
          (response) => {
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'El usuario ha sido eliminado correctamente.',
              }).then(() => {
                this.cargarUsuarios(); // Recargar usuarios
              });
            }
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar',
              text: 'Hubo un error al intentar eliminar el usuario. Por favor, inténtalo de nuevo.',
            });
            console.error('Error al eliminar usuario:', error);
          }
        );
      }
    });
  }
    

  
  
  cerrarModal(): void {
    const modalElement = document.getElementById('usuarioModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
