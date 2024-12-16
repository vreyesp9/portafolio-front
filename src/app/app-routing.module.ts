
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrincipalComponent } from './components/principal/principal.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [


    {
        path: 'auth',
        loadChildren: () => import('../app/components/auth/auth.module').then(m => m.AuthModule),
    },
    {
        path: '',
        loadChildren: () => import('../app/components/auth/auth.module').then(m => m.AuthModule),
    },

    {
      path: 'home',
      loadChildren: () => import('../app/components/principal/principal.module').then(m => m.PrincipalModule),
  },
  { path: 'reset-password', component: ResetPasswordComponent }
  
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
