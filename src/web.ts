import { WebPlugin } from '@capacitor/core';
import { CapMLPlugin } from './definitions';

export class CapMLWeb extends WebPlugin implements CapMLPlugin {
  constructor() {
    super({
      name: 'CapML',
      platforms: ['web']
    });
  }

  async echo(options: { value: string }): Promise<{value: string}> {
    console.log('ECHO', options);
    return options;
  }
}

const CapML = new CapMLWeb();

export { CapML };

import { registerWebPlugin } from '@capacitor/core';
registerWebPlugin(CapML);
