import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GraphQLModule } from 'src/app/app.apollo.config';

import { IonicModule } from '@ionic/angular';

import { CollectPage } from './collect.page';

const routes: Routes = [
  {
    path: '',
    component: CollectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GraphQLModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CollectPage]
})
export class CollectPageModule {}
