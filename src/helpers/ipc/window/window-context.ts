import { WIN_MINIMIZE_CHANNEL, WIN_MAXIMIZE_CHANNEL, WIN_CLOSE_CHANNEL,
    FTP_ASSETS, TEST_FTP_CONNECTION, SAVE_FTP_SETTINGS, GET_FTP_SETTINGS,
    GET_ASSET_DATA
} from "./window-channels";

type Channels = typeof WIN_MINIMIZE_CHANNEL | typeof WIN_MAXIMIZE_CHANNEL | typeof WIN_CLOSE_CHANNEL | typeof FTP_ASSETS | typeof TEST_FTP_CONNECTION | typeof SAVE_FTP_SETTINGS | typeof GET_FTP_SETTINGS | typeof GET_ASSET_DATA


export function exposeWindowContext() {
    const { contextBridge, ipcRenderer } = window.require("electron");
    contextBridge.exposeInMainWorld("electronWindow", {
        minimize: () => ipcRenderer.invoke(WIN_MINIMIZE_CHANNEL),
        maximize: () => ipcRenderer.invoke(WIN_MAXIMIZE_CHANNEL),
        close: () => ipcRenderer.invoke(WIN_CLOSE_CHANNEL),
        // FTP
        connect(ip: string, user: string, pass: string, port: string) {
          return ipcRenderer.invoke(TEST_FTP_CONNECTION, ip, user, pass, port);
        },
        saveSettings(ip: string, user: string, pass: string, port: string) {
          return ipcRenderer.invoke(SAVE_FTP_SETTINGS, ip, user, pass, port);
        },
        getSettings() {
          return ipcRenderer.invoke(GET_FTP_SETTINGS);
        },
        getAssetList() {
          return ipcRenderer.invoke(FTP_ASSETS);
        },
        on(channel: Channels, func: (...args: unknown[]) => void) {
          const subscription = (_event: any, ...args: unknown[]) => func(...args);
          ipcRenderer.on(channel, subscription);
          return () => {
            ipcRenderer.removeListener(channel, subscription);
          };
        },
        getAssetData(asset: any) {
          return ipcRenderer.invoke(GET_ASSET_DATA, asset);
        }
    });
}
