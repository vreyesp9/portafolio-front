import { Component, OnInit } from '@angular/core';
import { SiniestroService } from '../../services/siniestro.service';
import * as bootstrap from 'bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-siniestros',
  templateUrl: './siniestros.component.html',
  styleUrls: ['./siniestros.component.scss']
})
export class SiniestrosComponent implements OnInit {
  siniestros: any[] = [];
  filteredData: any[] = []; // Datos después de aplicar el filtro
  paginatedData: any[] = []; // Datos después de aplicar paginación
  tiposSiniestro: any[] = [];
  comunas: any[] = [];
  bomberos: any[] = [];
  usuarios: any[] = [];
  siniestroSeleccionado: any = {};
  currentPage: number = 1;
  pageSize: number = 4;
  totalRecords: number = 0;
  totalPages: number = 0;
  visiblePages: number[] = [];
  startPage: number = 1;
  endPage: number = 1;

  // Filtros
  filtroTexto: string = '';
  filtroSeleccionado: string = 'Sin filtro';
  filtrosDisponibles: string[] = [
    'Sin filtro',
    'clave_referencia',
    'fecha',
    'perdidas_materiales',
    'afectados',
    'implementos_utilizados',
    'nombre_tipo_siniestro',
    'nombre_comuna',
    'nombres',
    'rut',
    'descripcion'
  ];

  constructor(private siniestroService: SiniestroService) {}

  ngOnInit(): void {
    this.cargarSiniestros();
    this.cargarTiposSiniestro();
    this.cargarListas();
    this.cargarComunas();
    this.cargarBomberos();
    this.cargarUsuarios();
  }

  cargarSiniestros(): void {
    this.siniestroService.getSiniestro().subscribe(
      (response) => {
        console.log('Datos recibidos del backend:', response.data);
        if (response.success) {
          this.siniestros = response.data;
          this.filteredData = [...this.siniestros];
          this.totalRecords = this.filteredData.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.actualizarPaginador();
          this.paginateData();
        }
      },
      (error) => {
        console.error('Error al obtener los siniestros:', error);
      }
    );
  }
  

  aplicarFiltro(): void {
    if (!this.filtroSeleccionado || this.filtroSeleccionado === 'Sin filtro' || !this.filtroTexto.trim()) {
      this.filteredData = [...this.siniestros];
    } else {
      const texto = this.filtroTexto.toLowerCase();
      this.filteredData = this.siniestros.filter((siniestro) => {
        const valorCampo = siniestro[this.filtroSeleccionado];
        return valorCampo && valorCampo.toString().toLowerCase().includes(texto);
      });
    }
    this.currentPage = 1;
    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.actualizarPaginador();
    this.paginateData();
  }

  paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  actualizarPaginador(): void {
    const maxVisiblePages = 5;
    this.startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    this.endPage = Math.min(this.startPage + maxVisiblePages - 1, this.totalPages);

    if (this.endPage - this.startPage + 1 < maxVisiblePages) {
      this.startPage = Math.max(1, this.endPage - maxVisiblePages + 1);
    }

    this.visiblePages = Array.from({ length: this.endPage - this.startPage + 1 }, (_, i) => this.startPage + i);
  }

  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateData();
      this.actualizarPaginador();
    }
  }

  openModal(siniestro: any = null): void {
    if (siniestro) {
      // Mantener los demás datos, pero inicializar combobox en null
      this.siniestroSeleccionado = {
        id: siniestro.id,
        clave_referencia: siniestro.clave_referencia,
        fecha: this.convertirFecha(siniestro.fecha),
        hora: siniestro.hora,
        perdidas_materiales: siniestro.perdidas_materiales,
        afectados: siniestro.afectados,
        implementos_utilizados: siniestro.implementos_utilizados,
        tipo_siniestro_id: null, // Combobox vacío
        comuna_id: null, // Combobox vacío
        bombero_id: null, // Combobox vacío
        usuario_id: null, // Combobox vacío
        descripcion: siniestro.descripcion,
      };
    } else {
      // Inicializa un siniestro vacío para agregar
      this.siniestroSeleccionado = {
        id: null,
        clave_referencia: '',
        fecha: '',
        hora: '',
        perdidas_materiales: '',
        afectados: '',
        implementos_utilizados: '',
        tipo_siniestro_id: null,
        comuna_id: null,
        bombero_id: null,
        usuario_id: null,
        descripcion: '',
      };
    }
  
    const modal = new bootstrap.Modal(document.getElementById('siniestroModal'));
    modal.show();
  }
  
  private convertirFecha(fecha: string): string {
    if (!fecha) return ''; // Si la fecha es nula o vacía, devolver vacío
  
    // Detectar formatos no válidos o incompatibles
    const parsedDate = new Date(fecha);
    if (isNaN(parsedDate.getTime())) {
      console.warn('Fecha inválida detectada:', fecha);
      return ''; // Devolver vacío si la fecha no es válida
    }
  
    // Convertir la fecha al formato ISO (YYYY-MM-DD)
    return parsedDate.toISOString().split('T')[0];
  }
  
  
  
  // Helper para formatear fechas
  private formatDate(fecha: string): string {
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];
  }
  
  saveChanges(): void {
    // Validar solo los campos esenciales
    const camposRequeridos = [
      'clave_referencia', 'fecha', 'hora', 'perdidas_materiales', 'afectados',
      'implementos_utilizados', 'tipo_siniestro_id', 'comuna_id', 'bombero_id',
      'usuario_id', 'descripcion'
    ];
  
    for (const campo of camposRequeridos) {
      if (!this.siniestroSeleccionado[campo]) {
        Swal.fire('Error', `El campo ${campo} es obligatorio.`, 'error');
        return;
      }
    }
  
    if (this.siniestroSeleccionado.id) {
      // Llamada al servicio para actualizar
      this.siniestroService.updateSiniestro(this.siniestroSeleccionado).subscribe(() => {
        this.cargarSiniestros();
        this.closeModal();
        Swal.fire('Actualizado', 'El siniestro ha sido actualizado', 'success');
      });
    } else {
      // Llamada al servicio para agregar
      this.siniestroService.addSiniestro(this.siniestroSeleccionado).subscribe(() => {
        this.cargarSiniestros();
        this.closeModal();
        Swal.fire('Agregado', 'El siniestro ha sido agregado', 'success');
      });
    }
  }
  
  

  deleteSiniestro(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.siniestroService.deleteSiniestro(id).subscribe(() => {
          this.siniestros = this.siniestros.filter((s) => s.id !== id);
          this.aplicarFiltro();
          Swal.fire('Eliminado', 'El siniestro ha sido eliminado.', 'success');
        });
      }
    });
  }

  closeModal(): void {
    const modal = bootstrap.Modal.getInstance(document.getElementById('siniestroModal'));
    modal.hide();
  }

  cargarTiposSiniestro(): void {
    this.siniestroService.getTiposSiniestro().subscribe(
      (response) => {
        if (response.success) {
          this.tiposSiniestro = response.data;
        }
      },
      (error) => {
        console.error('Error al cargar tipos de siniestro:', error);
      }
    );
  }

  cargarListas(): void {
    this.cargarComunas();
    this.cargarBomberos();
    this.cargarUsuarios();
  }

  cargarComunas(): void {
    this.siniestroService.getComunas().subscribe((response) => {
      this.comunas = response.data;
    });
  }

  cargarBomberos(): void {
    this.siniestroService.getBomberos().subscribe((response) => {
      this.bomberos = response.data;
    });
  }

  cargarUsuarios(): void {
    this.siniestroService.getUsuarios().subscribe((response) => {
      this.usuarios = response.data;
    });
  }
}
