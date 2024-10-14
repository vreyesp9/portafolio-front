import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrincipalComponent } from './principal.component';
import { SiniestrosComponent } from './siniestros/siniestros.component';
import { ProyeccionesComponent } from './proyecciones/proyecciones.component';
import { AnalisisComponent } from './analisis/analisis.component';

const routes: Routes = [
  { path: '', component: PrincipalComponent },
  { path: 'siniestros', component: SiniestrosComponent },
  { path: 'proyecciones', component: ProyeccionesComponent },
  { path: 'analisis', component: AnalisisComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
],
})
export class PrincipalRoutingModule { }