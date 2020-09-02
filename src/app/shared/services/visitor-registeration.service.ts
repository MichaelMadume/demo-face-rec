import { Injectable, Inject } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as _ from 'lodash';
import { StorageService } from './storage.service';
import { DataType } from '../enums/new-form-data.enum';

export interface Visit {
  checkInTime: string;
  expression: string;
  name: string;
  phoneNumber: string;
  gender: string;
  age: number;
  hostName: string;
}


export interface Visitor {
  name: string;
  phoneNumber: string;
  descriptor: any;
  age?: number;
  gender: string;
}

@Injectable({
  providedIn: 'root'
})
export class VisitorRegisterationService {


  faceDetectionResult = [];

  recognisedVisitor: Visitor = null;

  visit: Visit;

  constructor(
    @Inject(Platform) platform: Platform,
    private storage: StorageService,
  ) { }

  addVisitor(visitor: Visitor) {
    const visitors = this.storage.get<Visitor[]>(DataType.visitors) ? this.storage.get<Visitor[]>(DataType.visitors) : [];
    const index = visitors.findIndex(v => ((v.name === visitor.name) && (v.phoneNumber === v.phoneNumber)));
    if (index !== -1) {
      visitors[index] = visitor;
    } else {
      if (visitors.length > 60) {
        visitors.pop();
      }
      visitors.unshift(visitor);
    }
    this.storage.set(DataType.visitors, visitors);
  }

  updateVisitor(visitor: Visitor) {
    const visitors = this.storage.get<Visitor[]>(DataType.visitors) ? this.storage.get<Visitor[]>(DataType.visitors) : [];
    const index = visitors.findIndex(v => ((v.name === visitor.name) && (v.phoneNumber === v.phoneNumber)));
    if (index !== -1) {
      visitors[index] = visitor;
    }
    this.storage.set(DataType.visitors, visitors);
  }

  addVisit(visit: Visit) {
    const visits = this.storage.get<Visit[]>(DataType.visitRecords) ? this.storage.get<Visit[]>(DataType.visitRecords) : [];
    this.visit = visit;
    if (visits.length > 300) {
      visits.pop();
    }
    visits.unshift(visit);
    this.storage.set(DataType.visitRecords, visits);
  }

}
