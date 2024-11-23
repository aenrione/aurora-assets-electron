import { Client } from 'basic-ftp';
import { FtpSettings, FtpResponse, StatusListener } from './types';
import { SettingsManager } from './settings-manager';

export class BaseFtpClient {
  protected client: Client | null = null;
  protected settings: FtpSettings;
  protected statusListeners: StatusListener[] = [];
  private static instance: BaseFtpClient | null = null;

  constructor() {
    this.settings = SettingsManager.load().ftp;

    if (BaseFtpClient.instance) {
      return BaseFtpClient.instance;
    }
    BaseFtpClient.instance = this;
    
    // Add cleanup handlers
    this.setupCleanupHandlers();
  }

  public addStatusListener(listener: StatusListener): void {
    this.statusListeners.push(listener);
  }

  protected sendStatusChanged(response: FtpResponse, ...params: any[]): void {
    const formattedMessage = params.length > 0 
      ? response.message.replace(/{(\d+)}/g, (_, num) => params[num]?.toString() || '') 
      : response.message;
    
    const parsedResponse: FtpResponse = {
      status: response.status,
      message: formattedMessage,
    };
    this.statusListeners.forEach(listener => listener(parsedResponse));
  }

  public get ipAddress(): string {
    return this.settings.ip;
  }

  public get username(): string {
    return this.settings.user;
  }

  public get password(): string {
    return this.settings.pass;
  }

  public get port(): string {
    return this.settings.port;
  }

  public saveSettings(ip: string, user: string, pass: string, port: string): void {
    this.settings = { ip, user, pass, port };
    SettingsManager.save({ ftp: this.settings });
  }

  protected async makeConnection(): Promise<boolean> {
    try {
      this.client = new Client();
      this.client.ftp.verbose = true;

      this.sendStatusChanged({ 
        status: 'online', 
        message: 'Connecting to {0}...' 
      }, this.settings.ip);

      await this.client.access({
        host: this.settings.ip,
        user: this.settings.user,
        password: this.settings.pass,
        port: parseInt(this.settings.port) || 21,
        secure: false
      });

      this.sendStatusChanged({ 
        status: 'online', 
        message: 'Connected to {0}' 
      }, this.settings.ip);

      return true;
    } catch {
      return false;
    }
  }

  public async throwErrors(msg: string) {
    this.sendStatusChanged({
      status: 'error',
      message: msg || 'An error occurred'
    });
  }

  private setupCleanupHandlers(): void {
    // Handle app quit
    process.on('exit', () => {
      this.disconnect();
    });

    // Handle Electron app quit
    if (process.type === 'browser') {
      const { app } = require('electron');
      app.on('before-quit', () => {
        this.disconnect();
      });
      
      // Handle development hot reload
      if (process.env.NODE_ENV === 'development') {
        app.on('will-quit', () => {
          this.disconnect();
        });
      }
    }

    // Handle termination signals
    ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
      process.on(signal, () => {
        this.disconnect();
        process.exit(0);
      });
    });
  }

  public async connect(ip: string, user: string, pass: string, port: string): Promise<boolean> {
    this.settings = { ip, user, pass, port };

    try {
      this.disconnect();
      const connected = await this.makeConnection();
      if (!connected) {
        this.sendStatusChanged({ 
          status: 'disconnected', 
          message: 'Connection failed' 
        });
        return false;
      }
      return true;
    } catch (ex: any) {
      this.sendStatusChanged({ 
        status: 'error', 
        message: ex.message 
      });
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.sendStatusChanged({ 
        status: 'disconnected', 
        message: 'Disconnected' 
      });
    }
  }
}

