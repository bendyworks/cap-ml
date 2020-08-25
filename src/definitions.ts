import '@capacitor/core';

declare module "@capacitor/core" {
  interface PluginRegistry {
    CapML: {
      detectText: Function;
    };
  }
}

export default {};
