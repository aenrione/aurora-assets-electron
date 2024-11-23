import { BrowserWindow, ipcMain } from "electron";
import { WIN_CLOSE_CHANNEL, WIN_MAXIMIZE_CHANNEL, WIN_MINIMIZE_CHANNEL,
    GET_FTP_SETTINGS, SAVE_FTP_SETTINGS, TEST_FTP_CONNECTION, FTP_ASSETS,
    SAVE_ASSET_CHANNEL, GET_ASSET_DATA
} from "./window-channels";
import { AuroraFtpClient, Asset } from '../ftp';

function setupFtpIpcHandlers(mainWindow: BrowserWindow) {
  const ftpOps = new AuroraFtpClient();

  // Add status listener
  ftpOps.addStatusListener((message) => {
    mainWindow.webContents.send('ftp-status', message);
  });

  // Handle IPC calls from renderer
  ipcMain.handle(TEST_FTP_CONNECTION, 
    async (_, ip: string, user: string, pass: string, port: string) => {
      return await ftpOps.connect(ip, user, pass, port);
  });

  ipcMain.handle(SAVE_FTP_SETTINGS, 
    (_, ip: string, user: string, pass: string, port: string) => {
      ftpOps.saveSettings(ip, user, pass, port);
  });

  ipcMain.handle(GET_FTP_SETTINGS, () => {
    return {
      ip: ftpOps.ipAddress,
      user: ftpOps.username,
      pass: ftpOps.password,
      port: ftpOps.port,
    };
  });

  ipcMain.handle(FTP_ASSETS, async () => {
    return await ftpOps.getAssetList();
  });

  ipcMain.handle(GET_ASSET_DATA, async (_, asset: Asset) => {
    return await ftpOps.getAssetData(asset);
  });
}


export function addWindowEventListeners(mainWindow: BrowserWindow) {
    ipcMain.handle(WIN_MINIMIZE_CHANNEL, () => {
        mainWindow.minimize();
    });
    ipcMain.handle(WIN_MAXIMIZE_CHANNEL, () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });
    ipcMain.handle(WIN_CLOSE_CHANNEL, () => {
        mainWindow.close();
    });
    
    setupFtpIpcHandlers(mainWindow);
}
