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
  private textDetections: TextDetection[];

  constructor() {}

  ngOnInit() {
  }

  async detectTextInImage() {
    this.imageFile = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    })
    console.log(this.imageFile.webPath)

    var response = await CapML.detectText({filename: this.imageFile.path!})

    // received Object to array
    response = Object.values(response.detectedText)
    // deserialize values in the array
    this.textDetections = response.map((textDetection: string) => <TextDetection>JSON.parse(textDetection))

    console.log(JSON.stringify(this.textDetections));
  }
}

interface TextDetection {
  bottomLeft: string;
  bottomRight: string;
  topLeft: string;
  topRight: string;
  text: string;
}
