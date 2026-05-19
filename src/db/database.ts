import * as SQLite from 'expo-sqlite';
import { CREATE_TABLES_SQL, SEED_EXERCISES_SQL } from './schema';

let _db: SQLite.SQLiteDatabase | null = null;

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!_db) {
    throw new Error('Database not initialised — call initDatabase() first');
  }
  return _db;
}

export async function initDatabase(): Promise<void> {
  if (_db) return;

  const db = await SQLite.openDatabaseAsync('gymlog.db');

  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  await db.execAsync(CREATE_TABLES_SQL);
  await db.execAsync(SEED_EXERCISES_SQL);

  _db = db;
}

export async function closeDatabase(): Promise<void> {
  if (_db) {
    await _db.closeAsync();
    _db = null;
  }
}
