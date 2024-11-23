import { app } from 'electron';
import { Settings } from './types';
import path from 'path';
import fs from 'fs';
export const userDataPath = app.getPath('userData');

export class SettingsManager {
  private static settingsPath = path.join(userDataPath, 'customSettings.json');

  private static defaultSettings: Settings = {
    ftp: {
      ip: '192.168.1.',
      user: 'xboxftp',
      pass: 'xboxftp',
      port: '21',
    }
  };

  public static get default(): Settings {
    return this.defaultSettings;
  }

  public static save(settings: Settings): void {
    fs.writeFileSync(this.settingsPath, JSON.stringify(settings, null, 2));
  }

  public static load(): Settings {
    if (!fs.existsSync(this.settingsPath)) {
      return this.defaultSettings;
    }
    return JSON.parse(fs.readFileSync(this.settingsPath, 'utf8'));
  }
}

