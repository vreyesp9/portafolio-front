import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule, ModalModule, TooltipModule } from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';
import { PrincipalRoutingModule } from './principal.routing.module';
import { PrincipalComponent } from './principal.component';
import { AnalisisComponent } from './analisis/analisis.component';
import { ProyeccionesComponent } from './proyecciones/proyecciones.component';
import { MainLayoutModule } from '../main-layout/main-layout.module';
import { SiniestrosComponent } from './siniestros/siniestros.component';
import { AddSiniestroComponent } from './siniestros/addSiniestro/add-siniestro.component';
import { MatTableModule } from '@angular/material/table';
import { Ng9RutModule } from 'ng9-rut';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';



@NgModule({
  declarations: [PrincipalComponent,SiniestrosComponent,AddSiniestroComponent,AnalisisComponent,ProyeccionesComponent,],
  imports: [
    PrincipalRoutingModule,
    TooltipModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
MainLayoutModule,
MatTableModule,
Ng9RutModule,
MatAutocompleteModule,
MatFormFieldModule,
MDBBootstrapModule.forRoot(),
ModalModule,

    
  ],
  entryComponents: [AddSiniestroComponent],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        disableClose: false,
        width: '600px',
        height: 'auto',
        position: { top: '0', left: '0' }, // Cambiar según necesidades
      },
    },
  ],
})
export class PrincipalModule {}