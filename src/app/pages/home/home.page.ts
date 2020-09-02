import { Component, OnInit, OnDestroy } from '@angular/core';
import { FrService } from 'src/app/shared/services/fr.service';
import { HiddenCameraService } from 'src/app/shared/services/hidden-camera.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { DataType } from 'src/app/shared/enums/new-form-data.enum';

import * as _ from 'lodash';
import { VisitorRegisterationService, Visitor, Visit } from 'src/app/shared/services/visitor-registeration.service';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/shared/services/alert.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, OnDestroy {

  faceDetectionResult = [];
  faceMatchCheckInterval: NodeJS.Timer;
  isFaceMatchEnabled: boolean;
  isFrInitialized: boolean;
  expressionOptions = {
    neutral: '😐',
    angry: '😡',
    sad: '😞',
    surprised: '😲',
    disgusted: '🤢',
    fearful: '😱',
    happy: '😁'
  };
  expression: string;

  registeredVisitors: Visitor[];
  wasVisitorRecognised: boolean;


  constructor(
    private fr: FrService,
    private hiddenCamera: HiddenCameraService,
    private storage: StorageService,
    private visRegService: VisitorRegisterationService,
    private navCtrl: NavController,
    private alert: AlertService
  ) { }

  async ngOnInit() {
    // this.storage.clearAll();

    this.registeredVisitors = this.storage.get<Visitor[]>(DataType.visitors);
    this.onFrInit();
    console.log(this.storage.get<Visit[]>(DataType.visitRecords));
    console.log(this.registeredVisitors);

  }

  async faceMatch() {
    await this.hiddenCamera.setupCamera();

    this.faceMatchCheckInterval = setInterval(async () => {
      if (this.isFaceMatchEnabled) {

        const faceDetectionOptions = {
          expression: true,
          ageAndGender: true,
          faceDescriptor: true,
          faceLandmarks: true,
        };

        this.faceDetectionResult = await this.fr.detectAllFaces(
          document.getElementById('hiddenVideo') as HTMLVideoElement, faceDetectionOptions);
        console.log(this.faceDetectionResult)
        if (this.faceDetectionResult.length) {
          this.expression = this.expressionOptions[this.fr.getExpression(this.faceDetectionResult[0].expressions)];
        }
      }
    }, 350);
  }

  onFrInit() {
    this.fr.isFrInitializedSubject.subscribe(status => {
      this.isFrInitialized = status;
      if (this.isFrInitialized) {
        this.isFaceMatchEnabled = true;
        this.faceMatch();
      }
    });
  }

  async signIn() {
    if (!this.faceDetectionResult.length) {
      return;
    }
    await this.setFaceDetectionResult();
    this.navCtrl.navigateRoot(this.wasVisitorRecognised ? '/old-visitor' : '/new-visitor', {
      animationDirection: 'forward'
    });

  }

  routeToReport() {
    const visits = this.storage.get<Visit[]>(DataType.visitRecords);
    if (!visits) {
      this.alert.presentAlertInfo('Reports', 'No visits have been registered on this system');
      return;
    }
    this.navCtrl.navigateRoot('/report', {
      animationDirection: 'forward'
    });
  }

  async setFaceDetectionResult() {
    let allVisitorsWithFaceDescriptors = this.registeredVisitors ? this.registeredVisitors : [];
    let faceDetectionResult = _.clone(this.faceDetectionResult);
    if (faceDetectionResult.length !== 1) {
      faceDetectionResult = [];
    } else {
      if (allVisitorsWithFaceDescriptors.length) {


        if (faceDetectionResult[0].genderProbability >= 0.9) {
          allVisitorsWithFaceDescriptors = this.filterVisitorsByGender(
            allVisitorsWithFaceDescriptors,
            (faceDetectionResult[0].gender === 'male'));
        }

        if (allVisitorsWithFaceDescriptors.length) {
          const recognitionResult = await this.fr.recogniseFaceFromDesciptors(
            this.getFaceDesciptorsOfVisitors(allVisitorsWithFaceDescriptors),
            faceDetectionResult[0].descriptor
          );
          if (recognitionResult.label !== 'unknown') {
            this.visRegService.recognisedVisitor = allVisitorsWithFaceDescriptors[+recognitionResult.label];
            console.log(this.visRegService.recognisedVisitor)
            this.wasVisitorRecognised = true;
          } else {
            this.visRegService.recognisedVisitor = null;
            this.wasVisitorRecognised = false;
          }
        }

      }
    }
    this.visRegService.faceDetectionResult = faceDetectionResult;
  }


  filterVisitorsByGender(visitors: Visitor[], isMale: boolean) {
    return visitors.filter(
      visitor => {
        const gender = isMale ? 'male' : 'female';
        return ((visitor.gender === gender) || (visitor.gender === '') || (!visitor.gender));
      }
    );
  }

  getFaceDesciptorsOfVisitors(visitors: Visitor[]) {
    return visitors.map(
      visitor => visitor.descriptor
    ).map(
      descriptor => this.fr.deserializeDescriptors(descriptor)
    );
  }

  ngOnDestroy() {
    this.hiddenCamera.stopCamera();
    this.isFaceMatchEnabled = false;
    clearInterval(this.faceMatchCheckInterval);
  }


}
