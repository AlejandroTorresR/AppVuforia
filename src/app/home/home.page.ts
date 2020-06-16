import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  videoOptions: VideoOptions;
  videoUrl: string;

  constructor(public modalController: ModalController, private videoPlayer: VideoPlayer) {

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
  }

  async playCard(name){
    try{
      this.videoOptions = {
        volume: 1
      }
      this.videoUrl = `file:///android_asset/www/assets/vuforia/${name}.mp4`;
      this.videoPlayer.play(this.videoUrl, this.videoOptions)
    }
    catch(e){
      console.error(e);
    }
  }

}
