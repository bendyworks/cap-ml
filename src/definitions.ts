declare module "@capacitor/core" {
  interface PluginRegistry {
    CapML: CapMLInterface;
  }
}

export interface CapMLInterface {
  detectText(filename: string): Promise<TextDetection[]>;
}

export interface TextDetection {
  bottomLeft: number[];
  bottomRight: number[];
  topLeft: number[];
  topRight: number[];
  text: string;
}
