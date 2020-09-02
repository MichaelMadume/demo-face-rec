import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportPageRoutingModule } from './report-routing.module';

import { ReportPage } from './report.page';
import { ExportAsService } from 'ngx-export-as';
import { ExportAsBtnComponent } from './export-as-btn/export-as-btn.component';
import {
  MatTableModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatMenuModule,
  MatInputModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPageRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatMenuModule
  ],
  providers: [ExportAsService],
  declarations: [ReportPage, ExportAsBtnComponent]
})
export class ReportPageModule { }
