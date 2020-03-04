import { WebPlugin } from '@capacitor/core';
import { CapMLInterface } from './definitions';

export class CapMLWeb extends WebPlugin implements CapMLInterface {
  constructor() {
    super({
      name: 'CapML',
      platforms: ['web']
    });
  }

  async detectText(filename: string): Promise<string> {
    return Promise.reject("Web Plugin Not implemented")
  }
}

const CapML = new CapMLWeb();

export { CapML };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(CapML);
