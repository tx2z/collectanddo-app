import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

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
    canActivate: [AuthGuard]
  },
  {
    path: 'collected',
    loadChildren: './collected/collected.module#CollectedPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'collection',
    loadChildren: './collection/collection.module#CollectionPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'collections',
    loadChildren: './collections/collections.module#CollectionsPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'do',
    loadChildren: './do/do.module#DoPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'event',
    loadChildren: './event/event.module#EventPageModule',
    canActivate: [AuthGuard]
  },
  { path: 'callback', loadChildren: './callback/callback.module#CallbackPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
