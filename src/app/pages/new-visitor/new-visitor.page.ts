import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { VisitorRegisterationService, Visit, Visitor } from 'src/app/shared/services/visitor-registeration.service';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FrService } from 'src/app/shared/services/fr.service';
import * as moment from 'moment';


@Component({
  selector: 'app-new-visitor',
  templateUrl: './new-visitor.page.html',
  styleUrls: ['./new-visitor.page.scss'],
})
export class NewVisitorPage implements OnInit {

  visitorForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private visRegService: VisitorRegisterationService,
    private navCtrl: NavController,
    private alert: AlertService,
    private fr: FrService
  ) { }

  ngOnInit() {
    this.visitorForm = this.formBuilder.group({
      name: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      hostName: ['', Validators.required],
    });
  }

  async checkIn() {
    if (this.visitorForm.invalid) {
      await this.alert.presentAlertInfo(
        'Visit Form',
        'Please complete the form before submitting.',
      );
      return;
    }
    const visitor: Visitor = {
      name: this.visitorForm.get('name').value,
      phoneNumber: `0${this.visitorForm.get('phoneNumber').value}`,
      descriptor: this.fr.serializeDescriptor([this.visRegService.faceDetectionResult[0].descriptor]),
      age: Math.round(this.visRegService.faceDetectionResult[0].age),
      gender: this.visRegService.faceDetectionResult[0].gender
    };

    const visit: Visit = {
      name: visitor.name,
      phoneNumber: visitor.phoneNumber,
      gender: visitor.gender,
      age: visitor.age,
      hostName: this.visitorForm.get('hostName').value,
      expression: this.fr.getExpression(this.visRegService.faceDetectionResult[0].expressions),
      checkInTime: moment().format('MMMM Do YYYY, h:mm:ss a')
    };

    this.visRegService.addVisit(visit);
    this.visRegService.addVisitor(visitor);

    this.navCtrl.navigateRoot('/completed', {
      animationDirection: 'forward'
    });
  }

}
