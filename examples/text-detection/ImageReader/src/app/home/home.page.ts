import { Component, OnInit } from '@angular/core';

import { Plugins, CameraSource, CameraResultType } from '@capacitor/core';
const { CapML, Camera } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private imageFile;

  constructor() {}

  ngOnInit() {
  }

  async detectTextInImage() {
    this.imageFile = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    })
    console.log(this.imageFile.webPath)
  }
}
