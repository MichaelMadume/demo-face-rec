import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewVisitorPageRoutingModule } from './new-visitor-routing.module';

import { NewVisitorPage } from './new-visitor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewVisitorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [NewVisitorPage]
})
export class NewVisitorPageModule {}
