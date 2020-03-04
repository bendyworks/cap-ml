import { Plugins } from '@capacitor/core';
import { CapMLInterface } from './definitions';
const { CapML } = Plugins;

export class CapMLPlugin implements CapMLInterface{
  // private textDetections: TextDetection;

  detectText(filename: string): Promise<string> {
    console.log(CapML)
    return Promise.resolve(filename)
  }
}
