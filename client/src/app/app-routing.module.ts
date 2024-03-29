import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', pathMatch: 'full',
    redirectTo: 'school'
  },
  {
    path: 'school',
    loadChildren: () => import('./school-login/verimarker-school-login.module').then(mod => mod.VerimarkerSchoolLoginModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
