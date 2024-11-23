export type FtpStatus = 'online' | 'aurora' | 'disconnected' | 'error';

export interface FtpSettings {
  ip: string;
  user: string;
  pass: string;
  port: string;
}

export interface FtpResponse {
  status: FtpStatus;
  message: string;
}

export interface StatusListener {
  (response: FtpResponse): void;
}

export interface Settings {
  ftp: FtpSettings;
}

export interface Asset {
  name: string;
  titleId: string;
  databaseId: string;
  mediaId?: string;
  dis?: string;
}
