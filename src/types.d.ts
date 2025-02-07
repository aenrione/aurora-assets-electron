// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Vite
// plugin that tells the Electron app where to look for the Vite-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;


// Preload types
interface ThemeModeContext {
    toggle: () => Promise<boolean>;
    dark: () => Promise<void>;
    light: () => Promise<void>;
    system: () => Promise<boolean>;
    current: () => Promise<"dark" | "light" | "system">;
}
interface ElectronWindow {
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    close: () => Promise<void>;
    connect: (ip: string, user: string, pass: string, port: string) => Promise<boolean>;
    saveSettings: (ip: string, user: string, pass: string, port: string) => Promise<void>;
    getSettings: () => Promise<{
      ip: string;
      user: string;
      pass: string;
      port: string;
    }>;
    on: (channel: string, func: (...args: unknown[]) => void) => () => void;
    getAssetList: () => Promise<any>;
    getAssetData: (asset: any) => Promise<any>;
}

declare interface Window {
    themeMode: ThemeModeContext;
    electronWindow: ElectronWindow;
}

