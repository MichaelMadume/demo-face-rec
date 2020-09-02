import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OldVisitorPageRoutingModule } from './old-visitor-routing.module';

import { OldVisitorPage } from './old-visitor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OldVisitorPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OldVisitorPage]
})
export class OldVisitorPageModule {}
