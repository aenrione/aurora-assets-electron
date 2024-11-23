import { app, BrowserWindow } from "electron";
import registerListeners from "./helpers/ipc/listeners-register";
// "electron-squirrel-startup" seems broken when packaging with vite
//import started from "electron-squirrel-startup";
import path from "path";
import { AuroraFtpClient } from "./helpers/ipc/ftp";

const inDevelopment = process.env.NODE_ENV === "development";
let ftpClient: AuroraFtpClient | null = null;

function createWindow() {
    if (ftpClient) {
        ftpClient.disconnect();
        ftpClient = null;
      }
    const preload = path.join(__dirname, "preload.js");
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            devTools: inDevelopment,
            contextIsolation: true,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: false,

            preload: preload,
        },
        titleBarStyle: "hidden",
    });
    registerListeners(mainWindow);

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
        );
    }
}

app.whenReady().then(createWindow);

//osX only
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
  if (ftpClient) {
    ftpClient.disconnect();
    ftpClient = null;
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
//osX only ends
