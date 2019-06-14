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
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule'
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
    path: 'collection',
    loadChildren: './collection/collection.module#CollectionPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'collections',
    loadChildren: './collections/collections.module#CollectionsPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'do',
    loadChildren: './do/do.module#DoPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'event',
    loadChildren: './event/event.module#EventPageModule',
    canActivate: [AuthGuardService]
  },
  { path: 'options', loadChildren: './options/options.module#OptionsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
