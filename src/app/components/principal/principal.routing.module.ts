import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrincipalComponent } from './principal.component';
import { SiniestrosComponent } from './siniestros/siniestros.component';
import { ProyeccionesComponent } from './proyecciones/proyecciones.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { MantenedorUsuarioComponent } from './mantenedor-usuario/mantenedor-usuario.component'; // Importar el componente
import { MatenedorBomberoComponent } from './matenedor-bombero/matenedor-bombero.component'; // Importar el componente

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'siniestros', component: SiniestrosComponent },
  { path: 'proyecciones', component: ProyeccionesComponent },
  { path: 'analisis', component: AnalisisComponent },
  { path: 'usuarioMantenedor', component: MantenedorUsuarioComponent }, // Nueva ruta para Usuarios
  { path: 'bomberoMantenedor', component: MatenedorBomberoComponent } // Nueva ruta para Usuarios
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class PrincipalRoutingModule { }
