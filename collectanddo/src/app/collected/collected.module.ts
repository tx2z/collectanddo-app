import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { GraphQLModule } from 'src/app/app.apollo.config';
import { IonicModule } from '@ionic/angular';
import { CollectedPage } from './collected.page';
import { AddButtonModule } from '../components/add-button/add-button.module';

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
    RouterModule.forChild(routes),
    AddButtonModule
  ],
  declarations: [
    CollectedPage
  ]
})
export class CollectedPageModule {}
