import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Plugins, CameraSource, CameraResultType, CameraPhoto } from '@capacitor/core';
import { TextDetector, TextDetection } from 'cap-ml';
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
  private scaleX = 300;
  private scaleY = 300;

  constructor(private loadingController: LoadingController) {}

  async ngOnInit() {}

  async detectTextInImage() {
    const loader = await this.loadingController.create({
      message: 'Processing Image...',
    })

    // Using the capacitor Plugin Camera to choose a picture from the device's 'Photos'
    Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    }).then(async imageFile => {
      this.imageFile = imageFile;
      const td = new TextDetector();

      // loader.present()
      this.textDetections = await td.detectText(imageFile.path!);
      console.log(this.textDetections);
      this.drawTextLocationsOnImage();
      // loader.dismiss();
    }).catch(error => console.error(error))
  }

  drawTextLocationsOnImage() {
    const svgContainer = this.svgContainer.nativeElement;
    this.clearPrevDetections(svgContainer);
    this.textDetections.forEach((detection: TextDetection) => {
      // the received coordinates are normalized by Vision framework, proportionate to the width and height of the image itself. Hence here, x coordinate is multiplied by image width(scaleX), and y with height(scaleY) to obtain de-normalized coordinates for the chosen image scale.
      const x = detection.bottomLeft[0] * this.scaleX
      // In addition to de-normalizing, subtracting from scaleY because TextDetector(which uses Apple's Vision Framework) assumes bottom-left as origin (0,0) vs SVG rect which assumes top-left as origin (0,0)
      const y = this.scaleY - (detection.topLeft[1] * this.scaleY)

      // Similar to the x and y coordinates above, the received coordinates are normalized by Vision framework, proportionate to the width and height of the image itself. Hence here, difference between corresponding x-coordinates is multiplied by image width(scaleX), and difference between corresponding y-coordinates is multiplied by image height(scaleY) to obtain de-normalized dimensions for the chosen image scale.
      let width = (detection.bottomRight[0] - detection.bottomLeft[0]) * this.scaleX
      let height = (detection.topLeft[1] - detection.bottomLeft[1]) * this.scaleY

      let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute("fill", "#000");
      rect.setAttribute('x', x.toString());
      rect.setAttribute('y', y.toString());
      rect.setAttribute('width', width.toString());
      rect.setAttribute('height', height.toString());
      rect.setAttribute('opacity', '0.4')
      rect.onclick = () => this.text = detection.text;
      svgContainer.appendChild(rect);
    })
  }

  clearPrevDetections(svgContainer: SVGElement) {
    while (svgContainer.childNodes.length > 1) {
      svgContainer.removeChild(svgContainer.lastChild);
    }
  }

}
