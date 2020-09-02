import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }



  async presentAlertConfirm(header: string, message: string, functionHandler: () => any, isMandatory?: boolean) {
    const buttonI = [
      {
        text: 'Cancel',
        cssClass: 'base-color',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        cssClass: 'base-color',
        text: 'Yes',
        handler: () => {
          functionHandler();
        }
      }
    ];
    const buttonIi = [
      {
        text: 'Ok',
        cssClass: 'base-color',
        role: 'cancel',
        handler: () => {
          functionHandler();
        }
      }
    ];

    const alert = await this.alertController.create({
      header,
      message,
      mode: 'ios',
      translucent: true,
      backdropDismiss: false,
      buttons: isMandatory ? buttonIi : buttonI
    });
    await alert.present();
  }

  async presentAlertInfo(header: string, message: string, handler = () => { }) {
    const alert = await this.alertController.create({
      header,
      message,
      mode: 'ios',
      translucent: true,
      buttons: [
        {
          cssClass: 'base-color',
          text: 'Ok',
          role: 'cancel',
          handler
        }
      ]
    });
    await alert.present();
  }
}
