import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController, Platform } from '@ionic/angular';
import { Plugins, CameraSource, CameraResultType, CameraPhoto } from '@capacitor/core';
import { TextDetector, TextDetection, ImageOrientation } from 'cap-ml';
const { Camera } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('svgContainer', { static: false})
  svgContainer: ElementRef<SVGElement>;

  private imageFile?: CameraPhoto;
  private textDetections: TextDetection[];
  private text: string;
  private orientation: ImageOrientation;
  private rotation = 0;
  private scaleX = 300;
  private scaleY = 300;

  constructor(private loadingController: LoadingController, private platform: Platform) {}

  ngOnInit() {
  }

  async detectTextInImage() {
    const loader = await this.loadingController.create({
      message: 'Processing Image...',
    })

    // Using the capacitor Plugin Camera to choose a picture from the device's 'Photos'
    Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      width: this.scaleX,
      height: this.scaleY,
    }).then(async imageFile => {
      this.imageFile = imageFile;
      const td = new TextDetector();

      loader.present()
      // detectText(filePath, orientation?)
      // orientation here is not the current orientation of the image, but the direction in which the image should be turned to make it upright
      // this.orientation = ImageOrientation.Up;
      this.rotation = Rotation[this.orientation];
      this.textDetections = await td.detectText(imageFile.path!, this.orientation);
      this.drawTextLocationsOnImage();
      loader.dismiss()
    }).catch(error => console.error(error))
  }

  drawTextLocationsOnImage() {
    const svgContainer = this.svgContainer.nativeElement;
    this.clearPrevDetections(svgContainer);
    this.textDetections.forEach((detection: TextDetection) => {
      let points = '';
      const coordinates = [detection.bottomLeft, detection.bottomRight, detection.topRight, detection.topLeft];

      // the received coordinates are normalized, proportionate to the width and height of the image itself. Hence here, x coordinate is multiplied by image width(scaleX), and y with height(scaleY) to obtain de-normalized coordinates for the chosen image scale. In addition to de-normalizing, subtracting from scaleY because cap-ml assumes bottom-left as origin (0,0) vs SVG rect which assumes top-left as origin (0,0)
      coordinates.forEach(coordinate => {
        points = points + coordinate[0]*this.scaleX + ' ' + (this.scaleY - (coordinate[1]*this.scaleY)) + ',';
      })
      points = points.slice(0, -1);  // removing the last comma

      let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute("fill", "#000");
      polygon.setAttribute("stroke", "#000")
      polygon.setAttribute('opacity', '0.4')
      polygon.setAttribute('points', points);
      polygon.onclick = () => this.text = detection.text;
      svgContainer.appendChild(polygon);
    })
  }

  clearPrevDetections(svgContainer: SVGElement) {
    while (svgContainer.childNodes.length > 1) {
      svgContainer.removeChild(svgContainer.lastChild);
    }
  }
}

enum Rotation {
  UP = 0,
  DOWN = 180,
  LEFT = 270,
  RIGHT = 90,
}
