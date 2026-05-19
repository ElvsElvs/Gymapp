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

    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  await seedDemoData(db);
}

async function seedDemoData(database: SQLite.SQLiteDatabase): Promise<void> {
  const flag = await database.getFirstAsync<{ value: string }>(
    "SELECT value FROM meta WHERE key = 'demo_seeded'"
  );
  if (flag) return;

  const sessions = [
    { date: '2026-02-14', weight: 70,  reps: [10, 10, 10, 10] },
    { date: '2026-02-25', weight: 80,  reps: [10, 10, 7] },
    { date: '2026-03-04', weight: 90,  reps: [7, 7, 5, 7] },
    { date: '2026-03-16', weight: 100, reps: [7, 9, 5, 4] },
    { date: '2026-03-30', weight: 105, reps: [4, 4, 4, 5] },
  ];

  await database.withTransactionAsync(async () => {
    for (const s of sessions) {
      const { lastInsertRowId: sessionId } = await database.runAsync(
        'INSERT INTO workout_sessions (name, date) VALUES (?, ?)',
        ['Chest + Triceps', s.date]
      );
      const { lastInsertRowId: exerciseId } = await database.runAsync(
        'INSERT INTO exercises (session_id, name, order_index) VALUES (?, ?, 0)',
        [sessionId, 'Barbell Bench Press']
      );
      for (let i = 0; i < s.reps.length; i++) {
        await database.runAsync(
          'INSERT INTO sets (exercise_id, reps, weight_kg, set_number) VALUES (?, ?, ?, ?)',
          [exerciseId, s.reps[i], s.weight, i + 1]
        );
      }
    }
    await database.runAsync(
      "INSERT INTO meta (key, value) VALUES ('demo_seeded', '1')"
    );
  });
}

export function getDatabase(): SQLite.SQLiteDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
}

export interface SessionWithStats {
  id: number;
  name: string;
  date: string;
  exercise_count: number;
  set_count: number;
}

export interface ExerciseWithSets {
  id: number;
  name: string;
  sets: { set_number: number; reps: number; weight_kg: number }[];
}

export async function getWorkoutHistory(): Promise<SessionWithStats[]> {
  const database = getDatabase();
  return database.getAllAsync<SessionWithStats>(`
    SELECT
      ws.id,
      ws.name,
      ws.date,
      COUNT(DISTINCT e.id) AS exercise_count,
      COUNT(s.id)          AS set_count
    FROM workout_sessions ws
    LEFT JOIN exercises e ON e.session_id = ws.id
    LEFT JOIN sets s      ON s.exercise_id = e.id
    GROUP BY ws.id
    ORDER BY ws.date DESC, ws.created_at DESC
  `);
}

export async function getSessionExercises(sessionId: number): Promise<ExerciseWithSets[]> {
  const database = getDatabase();
  const exercises = await database.getAllAsync<{ id: number; name: string }>(
    'SELECT id, name FROM exercises WHERE session_id = ? ORDER BY order_index',
    [sessionId]
  );
  return Promise.all(
    exercises.map(async e => {
      const sets = await database.getAllAsync<{ set_number: number; reps: number; weight_kg: number }>(
        'SELECT set_number, reps, weight_kg FROM sets WHERE exercise_id = ? ORDER BY set_number',
        [e.id]
      );
      return { ...e, sets };
    })
  );
}

export async function deleteSession(sessionId: number): Promise<void> {
  const database = getDatabase();
  await database.runAsync('DELETE FROM workout_sessions WHERE id = ?', [sessionId]);
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
