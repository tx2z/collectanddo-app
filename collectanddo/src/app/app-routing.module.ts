import { AuthGuardService } from './services/auth-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'collected',
    pathMatch: 'full'
  },
  {
    path: 'collect',
    loadChildren: './collect/collect.module#CollectPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'collected',
    loadChildren: './collected/collected.module#CollectedPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
  },
  { path: 'collections', loadChildren: './collections/collections.module#CollectionsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
