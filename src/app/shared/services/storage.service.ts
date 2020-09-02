import { Injectable } from '@angular/core';
import { LocalStorageService } from 'angular-web-storage';

import { DataType } from '../enums/new-form-data.enum';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  set<T>(type: DataType, data: T): void {
    const serializedData = JSON.stringify(data);
    this.localStorageService.set(type.toString(), serializedData);
  }

  get<T>(type: DataType): T {
    const serializedData = this.localStorageService.get(type.toString());
    if (serializedData) {
      const data = JSON.parse(serializedData);
      return data;
    } else {
      return null;
    }
  }

  clear(type: DataType): void {
    this.localStorageService.remove(type.toString());
  }

  clearAll(): void {
    this.localStorageService.clear();
  }
}
