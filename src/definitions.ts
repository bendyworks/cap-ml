declare module "@capacitor/core" {
  interface PluginRegistry {
    CapML: CapMLInterface;
  }
}

export interface CapMLInterface {
  detectText(filename: string): Promise<string>;
}
