import path = require('path');
import { open } from 'sqlite';
import sqlite3 from 'sqlite3'
import {Asset} from './types';

export const getAssetsFromDb = async (db_path: string): Promise<Asset[]> => {
  const file = path.join(db_path);
  const config ={
    filename: file,
    driver: sqlite3.Database
  }
  const db = await open(config);
  if (!db) return [];
  const rows = await db.all('SELECT * FROM ContentItems');
  return rows.map(row => ({
    name: row.TitleName,
    titleId: row.TitleId.toString(16).toUpperCase().padStart(8, '0'),
    databaseId: row.Id.toString(16).toUpperCase().padStart(8, '0'),
    mediaId: row.MediaId.toString(16).toUpperCase().padStart(8, '0'),
    dis: row.DiscNum.toString(),
  }));
}
