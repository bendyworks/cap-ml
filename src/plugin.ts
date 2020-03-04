import { Plugins } from '@capacitor/core';
import { CapMLInterface, TextDetection } from './definitions';
const { CapML } = Plugins;

export class CapMLPlugin implements CapMLInterface{

  async detectText(filename: string): Promise<TextDetection[]> {
    const response = await CapML.detectText({filename})
    return response.textDetections
  }
}
