import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GraphQLModule } from 'src/app/app.apollo.config';
import { IonicModule } from '@ionic/angular';
import { CollectionPage } from './collection.page';

const routes: Routes = [
  {
    path: '',
    component: CollectionPage
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
  declarations: [CollectionPage]
})
export class CollectionPageModule {}
