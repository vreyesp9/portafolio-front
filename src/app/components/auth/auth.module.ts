import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { AuthRoutingModule } from './auth.routing.module';
import { LoginComponent } from './login/login.component';
import { RutPipe } from '../pipe/rut.pipe';
import { TooltipModule } from 'angular-bootstrap-md';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [LoginComponent,RutPipe],
  imports: [
    AuthRoutingModule,
    TooltipModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
    
  ],
})
export class AuthModule {}