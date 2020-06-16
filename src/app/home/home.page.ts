import { Component, NgZone, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { VideoPlayer, VideoOptions } from '@ionic-native/video-player/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Zip } from '@ionic-native/zip/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{
  public vuforia: string = 'https://dl.dropboxusercontent.com/s/10trpcq1q875dv4/vuforia.zip';
  public fileTransfer: FileTransferObject = this.transfer.create();
  public progress: number = 0;
  public installing: number = 0;
  videoOptions: VideoOptions = {
    volume: 1
  };
  public targetList: any = [ 
    {file: '46986414', url: 'https://dl.dropboxusercontent.com/s/qcd6vp0tb22xeki/46986414.mp4'}, 
    {file: '89631139', url: 'https://dl.dropboxusercontent.com/s/97aqqx9oanel8fz/89631139.mp4'},
    {file: '73580471', url: 'https://dl.dropboxusercontent.com/s/qcd6vp0tb22xeki/46986414.mp4'},
    {file: '89943723', url: 'https://dl.dropboxusercontent.com/s/qcd6vp0tb22xeki/46986414.mp4'}
  ]

  constructor(public modalController: ModalController, 
              private file: File,
              private zip: Zip,
              public _zone: NgZone,
              private transfer: FileTransfer,
              private videoPlayer: VideoPlayer) {

    //this.downloadCardsUpdate();
    //this.downlaodVuforia();
  }

  ngOnInit(){

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage
    });
    return await modal.present();
  }

  async playCard(name){
    try{
      let videoUrl = `${this.file.dataDirectory}media/${name}.mp4`; //`file:///android_asset/www/assets/vuforia/${name}.mp4`;
      this.videoPlayer.play(videoUrl, this.videoOptions)
    }
    catch(e){
      console.error(e);
    }
  }

  downlaodVuforia(){
    this.fileTransfer.onProgress((progressEvent) => {
      if (progressEvent.lengthComputable) {
        this._zone.run(() => this.progress = Math.round((progressEvent.loaded / progressEvent.total) * 100) / 100)
      }
    } );
    this.fileTransfer.download(this.vuforia, `${this.file.dataDirectory}vuforia.zip`).then((entry) => {
      this.zip.unzip(`${this.file.dataDirectory}vuforia.zip`, `${this.file.dataDirectory}vuforia`, (progress) => {
        this._zone.run(() => this.installing = Math.round((progress.loaded / progress.total) * 100) / 100);
      })
    .then((result) => {
      if(result === 0) {
        console.log('SUCCESS')
        this.file.removeFile(`${this.file.dataDirectory}`, 'vuforia.zip')
      };
      if(result === -1) {
        console.log('FAILED')
      };
    });
    }, (error) => {
      alert('Connection failed, close and try again.')
    });
  }

  downloadSingleCard(name, url){
    this.fileTransfer.download(url, `${this.file.dataDirectory}media/${name}.mp4`)
  }

  removeSingleCard(name){
    this.file.removeFile(`${this.file.dataDirectory}media`, `${name}.mp4`)
  }

}
