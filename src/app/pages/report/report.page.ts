import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Visit } from 'src/app/shared/services/visitor-registeration.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DataType } from 'src/app/shared/enums/new-form-data.enum';
import { AlertService } from 'src/app/shared/services/alert.service';
import { async } from '@angular/core/testing';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  expressionOptions = {
    neutral: '😐',
    angry: '😡',
    sad: '😞',
    surprised: '😲',
    disgusted: '🤢',
    fearful: '😱',
    happy: '😁'
  };

  tableHeaders: string[] = ['Name', 'Phone Number', 'Gender', 'Age Estimate', 'Whom to See', 'Time In', 'Facial Expression'];
  displayedColumns: string[] = ['name', 'phoneNumber', 'gender', 'age', 'hostName', 'checkInTime', 'expression'];
  dataSource: MatTableDataSource<Visit>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private storage: StorageService,
    private alert: AlertService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.initTable();
  }

  initTable() {
    this.dataSource = new MatTableDataSource(this.storage.get<Visit[]>(DataType.visitRecords));

    this.dataSource.filterPredicate = (visit, filter: string) => {
      const filterValue = filter.trim().toLocaleLowerCase();
      return (
        visit.name.toString().toLocaleLowerCase().includes(filterValue) ||
        visit.hostName.toString().toLocaleLowerCase().includes(filterValue) ||
        visit.phoneNumber.toString().toLocaleLowerCase().includes(filterValue) ||
        visit.expression.toString().toLocaleLowerCase().includes(filterValue) ||
        visit.gender === this.genderFilterHelper(filterValue) ||
        this.ageFilterHelper(filterValue, visit.age)
      );
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  genderFilterHelper(filterValue) {
    if (['male', 'man', 'men', 'boy', 'boys', 'mr', 'mister', 'master'].includes(filterValue)) {
      return 'male';
    }
    if (['female', 'woman', 'lady', 'ladies', 'women', 'girl', 'girls', 'miss', 'mrs', 'ms'].includes(filterValue)) {
      return 'female';
    }
  }

  ageFilterHelper(filterValue, age: number) {
    if (!age) {
      return false;
    }

    if (!isNaN(filterValue)) {
      return +filterValue === age;
    }

    if (isNaN(filterValue)) {
      if (['child', 'minor', 'teen', 'children'].includes(filterValue)) {
        return age < 18;
      }
      if (['youth', 'adult', 'young', 'young adult', 'young-adult'].includes(filterValue)) {
        return (age >= 18) && (age < 35);
      }
      if (['adult', 'mature'].includes(filterValue)) {
        return (age >= 35);
      }
      if (['elderly', 'old', 'mature'].includes(filterValue)) {
        return (age >= 50);
      }
    }
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    console.log(this.dataSource)
  }

  async deleteRecords() {
    await this.alert.presentAlertConfirm(
      'Visit Records',
      'This Action Will Purge All Existing Records. Please Confirm?',
      async () => {
        this.storage.clearAll();
        this.navCtrl.navigateRoot('/', {
          animationDirection: 'back'
        });
      })
  }
}
