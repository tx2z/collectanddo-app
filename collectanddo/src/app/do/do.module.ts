import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GraphQLModule } from 'src/app/app.apollo.config';

import { IonicModule } from '@ionic/angular';

import { DoPage } from './do.page';

const routes: Routes = [
  {
    path: '',
    component: DoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphQLModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DoPage]
})
export class DoPageModule {}
