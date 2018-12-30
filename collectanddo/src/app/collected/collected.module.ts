import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GraphQLModule } from 'src/app/app.apollo.config';

import { IonicModule } from '@ionic/angular';

import { CollectedPage } from './collected.page';

const routes: Routes = [
  {
    path: '',
    component: CollectedPage
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
  declarations: [CollectedPage]
})
export class CollectedPageModule {}
