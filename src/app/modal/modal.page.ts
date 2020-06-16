import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import { File } from '@ionic-native/file/ngx';
declare var navigator;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalPage implements OnInit {
  videoOptions: VideoOptions = {
    volume: 1
  };
  public options = {
    databaseXmlFile: `${this.file.dataDirectory}vuforia/allCards.xml`,
    targetList: [ '46986414', '89631139', '73580471', '89943723' ],
    showAndroidCloseButton: true,
    autostopOnImageFound: true,
    //overlayMessage: 'Point your camera at a test image...',
    vuforiaLicense: 'AT6KxGn/////AAABmQ2MAv3VXk+diX7A7XK7DExikEtTGSB4xQNVWIyEJaYsv1bEXWWyx3mW16TDmN5XxNI+dT4IOJ4m37ZrgqrdVoaf9ykkZZ97j74tOBmcQfEX8NEngnMWas2ddjkBVKBT1nCBb3o2whR+wmiOKoIrnjWBXtiAtbr3WEB5w+D17wOZykkOJqPzvWzOzRxNNB6wxkQcAlrKa1/i9hWobc6LedCduCc4HnWBnxaNY6tSXRef4ke+iC3WIKXnv/VPY3EL32BeFKlrMXxXVLMDCJatO++lWkpHCI9lTkfy2UW98hXWsysjwyQrhHTCuUjo/yf+/1EkdDVqSvqkOLSGMdSjt5fBj5QnbHrMGjrcLCNxZdOx'
  };

  constructor(public modalController: ModalController,
              private videoPlayer: VideoPlayer,
              private file: File,
              public alertController: AlertController) {

  }

  ngOnInit() {
    navigator.VuforiaPlugin.startVuforia(
      this.options, (data) => {
        console.log(data);
        if(data.status.imageFound) {
          this.playCard(data.result.imageName);
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

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  playCard2(name){ //`${this.file.dataDirectory}media/${name}.mp4` //`file:///android_asset/www/assets/vuforia/${name}.mp4`
    this.videoPlayer.play(`${this.file.dataDirectory}media/${name}.mp4`,{volume: 1}).then(() => {
     console.log('video completed');
     this.dismiss();
    }).catch(err => {
     console.log(err);
    });
  }

  async playCard(name){
    try{
      let videoUrl = `${this.file.dataDirectory}media/${name}.mp4`;
      this.videoPlayer.play(videoUrl, this.videoOptions).then(()=>{
        console.log('video completed');
        this.dismiss();
      })
    }
    catch(e){
      console.error(e);
    }
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

}