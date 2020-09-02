import { Component, OnInit } from '@angular/core';
import { VisitorRegisterationService, Visitor, Visit } from 'src/app/shared/services/visitor-registeration.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';
import { FrService } from 'src/app/shared/services/fr.service';
import moment from 'moment';

@Component({
  selector: 'app-old-visitor',
  templateUrl: './old-visitor.page.html',
  styleUrls: ['./old-visitor.page.scss'],
})
export class OldVisitorPage implements OnInit {

  visitorName: string;
  visitorForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private visRegService: VisitorRegisterationService,
    private navCtrl: NavController,
    private alert: AlertService,
    private fr: FrService,
  ) { }

  ngOnInit() {
    this.visitorName = this.visRegService.recognisedVisitor.name;
    this.visitorForm = this.formBuilder.group({
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


    const visitor: Visitor = this.updateVisitor();

    const visit: Visit = {
      name: visitor.name,
      phoneNumber: visitor.phoneNumber,
      gender: visitor.gender,
      age: Math.round(this.visRegService.faceDetectionResult[0].age),
      hostName: this.visitorForm.get('hostName').value,
      expression: this.fr.getExpression(this.visRegService.faceDetectionResult[0].expressions),
      checkInTime: moment().format('MMMM Do YYYY, h:mm:ss a')
    };

    this.visRegService.addVisit(visit);
    this.visRegService.updateVisitor(visitor);

    this.navCtrl.navigateRoot('/completed', {
      animationDirection: 'forward'
    });
  }

  updateVisitor() {
    const visitor = this.visRegService.recognisedVisitor;
    visitor.descriptor = this.fr.serializeDescriptor(
      this.fr.updateFaceDescriptor(
        this.fr.deserializeDescriptors(visitor.descriptor),
        this.visRegService.faceDetectionResult[0].descriptor)
    );
    visitor.age = Math.round(this.visRegService.faceDetectionResult[0].age);
    visitor.gender = this.visRegService.faceDetectionResult[0].gender;
    return visitor;
  }

}
