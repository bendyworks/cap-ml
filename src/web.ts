import { WebPlugin } from '@capacitor/core';
import { TextDetection, ImageOrientation } from './text-detector/index';

export class CapMLWeb extends WebPlugin {
  constructor() {
    super({
      name: 'CapML',
      platforms: ['web']
    });
  }

  async detectText(filename: string, orientation?: ImageOrientation): Promise<TextDetection[]> {
    return Promise.reject("Web Plugin Not implemented")
  }
}

const CapML = new CapMLWeb();

export { CapML };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(CapML);
