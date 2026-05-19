import * as SQLite from 'expo-sqlite';

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

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workout_sessions (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      name             TEXT    NOT NULL,
      started_at       INTEGER NOT NULL,
      finished_at      INTEGER,
      duration_seconds INTEGER,
      notes            TEXT
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      name         TEXT    NOT NULL UNIQUE,
      muscle_group TEXT,
      equipment    TEXT
    );

    CREATE TABLE IF NOT EXISTS sets (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id  INTEGER NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
      exercise_id INTEGER NOT NULL REFERENCES exercises(id),
      set_number  INTEGER NOT NULL,
      reps        INTEGER,
      weight_kg   REAL,
      rpe         REAL
    );

    CREATE TABLE IF NOT EXISTS body_weight (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      weight_kg   REAL    NOT NULL,
      recorded_at INTEGER NOT NULL,
      notes       TEXT
    );
  `);

  _db = db;
}
