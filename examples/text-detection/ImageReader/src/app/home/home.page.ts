import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Plugins, CameraSource, CameraResultType, CameraPhoto } from '@capacitor/core';
const { Camera } = Plugins;

import { CapMLPlugin } from 'cap-ml';

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

  constructor() {}

  ngOnInit() {}

  async detectTextInImage() {

    this.imageFile = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    })

    let ml = new CapMLPlugin();
    var response = await ml.detectText(this.imageFile.path!)
    // this.textDetections = response.detectedText;
    console.log('detectText', response)
    // this.drawTextLocationsOnImage();
  }

  drawTextLocationsOnImage() {
    const svgContainer = this.svgContainer.nativeElement;
    this.clearPrevDetections(svgContainer);

    this.textDetections.forEach((detection: TextDetection) => {
      // how about tilted rectangles
      let width = (detection.bottomRight[0] - detection.bottomLeft[0]) * this.scaleX
      let height = (detection.topLeft[1] - detection.bottomLeft[1]) * this.scaleY

      let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute("fill", "#000");
      rect.setAttribute('x', (detection.bottomLeft[0] * this.scaleX).toString());
      rect.setAttribute('y', (this.scaleY - (detection.topLeft[1] * this.scaleY)).toString());
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

interface TextDetection {
  bottomLeft: number[];
  bottomRight: number[];
  topLeft: number[];
  topRight: number[];
  text: string;
}
