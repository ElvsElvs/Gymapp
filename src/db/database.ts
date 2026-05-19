import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync('gymlog.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS workout_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id INTEGER NOT NULL,
      reps INTEGER NOT NULL,
      weight_kg REAL NOT NULL,
      set_number INTEGER NOT NULL,
      FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS body_weight (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      weight_kg REAL NOT NULL,
      notes TEXT
    );
  `);
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

export async function saveWorkout(
  name: string,
  exercises: { name: string; sets: { reps: number; weight: number }[] }[]
): Promise<void> {
  const database = getDatabase();
  const date = new Date().toISOString().split('T')[0];

  await database.withTransactionAsync(async () => {
    const sessionResult = await database.runAsync(
      'INSERT INTO workout_sessions (name, date) VALUES (?, ?)',
      [name, date]
    );
    const sessionId = sessionResult.lastInsertRowId;

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      const exerciseResult = await database.runAsync(
        'INSERT INTO exercises (session_id, name, order_index) VALUES (?, ?, ?)',
        [sessionId, exercise.name, i]
      );
      const exerciseId = exerciseResult.lastInsertRowId;

      for (let j = 0; j < exercise.sets.length; j++) {
        const s = exercise.sets[j];
        await database.runAsync(
          'INSERT INTO sets (exercise_id, reps, weight_kg, set_number) VALUES (?, ?, ?, ?)',
          [exerciseId, s.reps, s.weight, j + 1]
        );
      }
    }
  });
}
