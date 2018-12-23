import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'collected',
    pathMatch: 'full'
  },
  { path: 'collect', loadChildren: './collect/collect.module#CollectPageModule' },
  { path: 'collected', loadChildren: './collected/collected.module#CollectedPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
