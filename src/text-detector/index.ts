import { Plugins } from '@capacitor/core';
const { CapML } = Plugins;

export class TextDetector implements TextDetectorInterface{

  async detectText(filename: string, orientation?: ImageOrientation): Promise<TextDetection[]> {
    const response = await CapML.detectText({filename, orientation})
    return response.textDetections
  }
}

export interface TextDetectorInterface {
  detectText(filename: string, orientation: ImageOrientation): Promise<TextDetection[]>;
}

export interface TextDetection {
  bottomLeft: [number, number]; // [x-coordinate, y-coordinate]
  bottomRight: [number, number]; // [x-coordinate, y-coordinate]
  topLeft: [number, number]; // [x-coordinate, y-coordinate]
  topRight: [number, number]; // [x-coordinate, y-coordinate]
  text: string;
}

export enum ImageOrientation {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
