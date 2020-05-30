import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
declare var navigator;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalPage implements OnInit {
  public options = {
    databaseXmlFile: 'AllCards.xml',
    targetList: [ '77585513', '46657337' ],
    showAndroidCloseButton: true,
    autostopOnImageFound: true,
    //overlayMessage: 'Point your camera at a test image...',
    vuforiaLicense: 'AT6KxGn/////AAABmQ2MAv3VXk+diX7A7XK7DExikEtTGSB4xQNVWIyEJaYsv1bEXWWyx3mW16TDmN5XxNI+dT4IOJ4m37ZrgqrdVoaf9ykkZZ97j74tOBmcQfEX8NEngnMWas2ddjkBVKBT1nCBb3o2whR+wmiOKoIrnjWBXtiAtbr3WEB5w+D17wOZykkOJqPzvWzOzRxNNB6wxkQcAlrKa1/i9hWobc6LedCduCc4HnWBnxaNY6tSXRef4ke+iC3WIKXnv/VPY3EL32BeFKlrMXxXVLMDCJatO++lWkpHCI9lTkfy2UW98hXWsysjwyQrhHTCuUjo/yf+/1EkdDVqSvqkOLSGMdSjt5fBj5QnbHrMGjrcLCNxZdOx'
  };

  constructor(public modalController: ModalController, public alertController: AlertController) { }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  async presentAlert(name) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: "Image name: "+ name,
      buttons: [{
          text: 'Ok',
          handler: () => {
            this.dismiss();
          }
        }]
    });

    await alert.present();
  }

  ngOnInit() {
    navigator.VuforiaPlugin.startVuforia(
      this.options,
      (data) => {
        // To see exactly what `data` can return, see 'Success callback `data` API' within the plugin's documentation.
        console.log(data);
        
        if(data.status.imageFound) {
          this.presentAlert(data.result.imageName);
        }
        else if (data.status.manuallyClosed) {
          this.presentAlert("User manually closed Vuforia by pressing back!");
        }
      },
      function(data) {
        alert("Error: " + data);
      }
    );
  }
}