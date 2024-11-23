import { BaseFtpClient } from './base-ftp-client';
import {Asset} from './types';
import {userDataPath} from './settings-manager';
import { getAssetsFromDb } from './sqlite';

const AURORA_DATA_DIR = "/Game/Data/";
const AURORA_DB_DIR = "/Game/Data/DataBases/";
const AURORA_DB_FILE = "content.db";
const AURORA_ASSET_DIR = "/Game/Data/GameData/";

const FULL_DB_FILE = `${userDataPath}/${AURORA_DB_FILE}`;
const LOCAL_ASSET_DIR = `${userDataPath}/GameData/`;
const TMP_ASSET_DIR = `${userDataPath}/tmp/`;

function getGameFileNamesFromAsset(asset: Asset): string[] {
  return [
    `GC${asset.titleId}.asset`,
    `BK${asset.titleId}.asset`,
    `LC${asset.databaseId}.asset`,
    `SS${asset.databaseId}.asset`,
  ]
}

export class AuroraFtpClient extends BaseFtpClient {
  public async getAssetList(): Promise<Asset[]|string[]> {
    const hasDir = await this.navigateToDir(AURORA_ASSET_DIR);
    if (!hasDir) return [];
    const downloadDB = await this.downloadContentDb();
    if (!downloadDB) return [];
    const assets = getAssetsFromDb(FULL_DB_FILE);
    return assets;
  }

  public async navigateToDir(dir: string): Promise<boolean> {
    if (!this.client?.closed) {
      if (!await this.makeConnection()) {
        this.sendStatusChanged({ 
          status: 'disconnected', 
          message: 'Connection failed to {0}' 
        }, this.settings.ip);
        return false;
      }
    }

    if (!this.client) return false;

    try {
      await this.client.cd(dir);
      const currentDir = await this.client.pwd();
      return currentDir.toLowerCase() === dir.toLowerCase();
    } catch {
      this.sendStatusChanged({
        status: 'disconnected',
        message: 'Failed to change directory to {0}'
      }, dir);
      return false;
    }
  }

  public async navigateToAssetDir(assetName: string): Promise<boolean> {
    if (!await this.navigateToDir(AURORA_DATA_DIR)) return false;

    const dir = `${AURORA_ASSET_DIR}${assetName}/`;
    try {
      await this.client!.cd(dir);
      const currentDir = await this.client!.pwd();
      return currentDir.toLowerCase() === dir.toLowerCase();
    } catch {
      return false;
    }
  }

public async getDirList(): Promise<string[]> {
    if (!this.client) return [];
    
    try {
      const list = await this.client.list();
      return list
        .filter(item => item.isDirectory)
        .map(item => item.name);
    } catch (error) {
      console.error('List directory error:', error);
      // Attempt to reconnect and try again
      if (await this.makeConnection()) {
        try {
          const list = await this.client!.list();
          return list
            .filter(item => item.isDirectory)
            .map(item => item.name);
        } catch (retryError) {
          console.error('List directory retry error:', retryError);
          this.throwErrors('Make sure you have Aurora Running');
          return [];
        }
      }
      this.throwErrors('Failed to list directory');
      return [];
    }
  }

  public async getAssetData(asset: Asset): Promise<Buffer | null> {
    const assetDir = `${asset.titleId}_${asset.databaseId}`;
    if (!await this.navigateToAssetDir(assetDir)) return null;

    try {
      const gameFiles = getGameFileNamesFromAsset(asset);
      for (const file of gameFiles) {
        try {
          await this.client!.downloadTo(`${TMP_ASSET_DIR}${file}`, file);
        } catch (error) {
          console.error(`Failed to download file: ${file}: ${error}`);
        }
      }
      return null
    } catch (error) {
      console.error('Download error:', error);
      // Attempt to reconnect and try again
      if (await this.makeConnection()) {
        if (!await this.navigateToAssetDir(assetDir)) return null;
        try {
          console.log('List:');
        } catch (retryError) {
          console.error('Download retry error:', retryError);
          this.throwErrors('Failed to download data');
          return null;
        }
      }
      return null;
    }
  }

  // public async sendAssetData(file: string, assetDir: string, data: Buffer): Promise<boolean> {
  //   if (!await this.navigateToAssetDir(assetDir)) return false;
  //
  //   try {
  //     await this.client!.uploadFrom(data, file);
  //     return true;
  //   } catch (error) {
  //     console.error('Upload error:', error);
  //     // Attempt to reconnect and try again
  //     if (await this.makeConnection()) {
  //       if (!await this.navigateToAssetDir(assetDir)) return false;
  //       try {
  //         await this.client!.uploadFrom(data, file);
  //         return true;
  //       } catch (retryError) {
  //         console.error('Upload retry error:', retryError);
  //         return false;
  //       }
  //     }
  //     return false;
  //   }
  // }

  public async downloadContentDb(): Promise<boolean> {
    if (!this.client?.closed) {
      if (!await this.makeConnection()) {
        this.sendStatusChanged({ 
          status: 'disconnected', 
          message: 'Connection failed to {0}' 
        }, this.settings.ip);
        return false;
      }
    }

    if (!this.client) return false;

    const dir = AURORA_DB_DIR;
    const savePath = FULL_DB_FILE;
    this.sendStatusChanged({ 
      status: 'online', 
      message: 'Changing working directory to {0}...' 
    }, dir);

    try {
      await this.client.cd(dir);
      await this.client.downloadTo(savePath, AURORA_DB_FILE);
      return true;
    } catch {
      this.sendStatusChanged({
        status: 'error',
        message: 'Failed to download {0}'
      }, AURORA_DB_FILE);
      return false;
    }
  }
}

