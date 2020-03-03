declare module "@capacitor/core" {
  interface PluginRegistry {
    CapML: CapMLPlugin;
  }
}

export interface CapMLPlugin {
  echo(options: { value: string }): Promise<{value: string}>;
}
