import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import exportFromJSON from 'export-from-json';

@Component({
  selector: 'app-export-as-btn',
  templateUrl: './export-as-btn.component.html',
  styleUrls: ['./export-as-btn.component.scss']
})
export class ExportAsBtnComponent implements OnInit {

  @Input() tableID: string;
  @Input() fileName: string;
  @Input() datasource: MatTableDataSource<any>;

  constructor(private exportAsService: ExportAsService) { }

  ngOnInit(): void {
  }

  isDataSourceEmpty(): boolean {
    if (!this.datasource) { return true; }
    return (this.datasource.filteredData.length <= 0);
  }

  exportAsXLSX(): void {
    // let exportAsConfig: ExportAsConfig;
    if (this.tableID) {
      // exportAsConfig = {
      //   type: 'xlsx',
      //   elementId: this.tableID,
      // }
      // this.exportAsService.save(exportAsConfig, this.fileName).subscribe();
      const data = this.datasource.filteredData;
      exportFromJSON({ data, fileName: this.fileName, exportType: 'csv' });
    }
  }

  exportAsDOCX(): void {
    let exportAsConfig: ExportAsConfig;
    if (this.tableID) {
      exportAsConfig = {
        type: 'docx',
        elementIdOrContent: this.tableID,
        options: {
          margins: {
            top: '50'
          }
        }
      }
      this.exportAsService.save(exportAsConfig, this.fileName).subscribe();
    }
  }

  exportAsPNG(): void {
    let exportAsConfig: ExportAsConfig;
    if (this.tableID) {
      exportAsConfig = {
        type: 'png',
        elementIdOrContent: this.tableID,
      }
      this.exportAsService.save(exportAsConfig, this.fileName).subscribe();
    }
  }

  exportAsPDF(): void {
    let exportAsConfig: ExportAsConfig;
    if (this.tableID) {
      exportAsConfig = {
        type: 'pdf',
        elementIdOrContent: this.tableID,
        options: { jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' } }
      }
      this.exportAsService.save(exportAsConfig, this.fileName).subscribe();
    }
  }

}
