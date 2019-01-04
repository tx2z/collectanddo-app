import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GraphQLModule } from 'src/app/app.apollo.config';

import { IonicModule } from '@ionic/angular';

import { CollectionsPage } from './collections.page';

const routes: Routes = [
  {
    path: '',
    component: CollectionsPage
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
  declarations: [CollectionsPage]
})
export class CollectionsPageModule {}
