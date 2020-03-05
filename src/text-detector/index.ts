import { Plugins } from '@capacitor/core';
const { CapML } = Plugins;

export class TextDetector implements TextDetectorInterface{

  async detectText(filename: string): Promise<TextDetection[]> {
    const response = await CapML.detectText({filename})
    return response.textDetections
  }
}

export interface TextDetectorInterface {
  detectText(filename: string): Promise<TextDetection[]>;
}

export interface TextDetection {
  bottomLeft: number[]; // [x-coordinate, y-coordinate]
  bottomRight: number[]; // [x-coordinate, y-coordinate]
  topLeft: number[]; // [x-coordinate, y-coordinate]
  topRight: number[]; // [x-coordinate, y-coordinate]
  text: string;
}
