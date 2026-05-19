import { getDatabase } from '../db/database';
import type { WorkoutSession, WorkoutSet, WorkoutSetWithExercise, SessionWithSets } from '../types';

export async function getRecentSessions(limit = 20): Promise<WorkoutSession[]> {
  const db = getDatabase();
  return db.getAllAsync<WorkoutSession>(
    `SELECT * FROM workout_sessions
     ORDER BY started_at DESC
     LIMIT ?`,
    [limit],
  );
}

export async function getSessionById(id: number): Promise<SessionWithSets | null> {
  const db = getDatabase();
  const session = await db.getFirstAsync<WorkoutSession>(
    'SELECT * FROM workout_sessions WHERE id = ?',
    [id],
  );
  if (!session) return null;

  const sets = await db.getAllAsync<WorkoutSetWithExercise>(
    `SELECT s.*, e.name AS exercise_name, e.muscle_group
     FROM sets s
     JOIN exercises e ON e.id = s.exercise_id
     WHERE s.session_id = ?
     ORDER BY s.set_number ASC`,
    [id],
  );

  return { ...session, sets };
}

export async function startSession(
  name: string,
  programId?: number,
): Promise<WorkoutSession> {
  const db = getDatabase();
  const now = Math.floor(Date.now() / 1000);
  const result = await db.runAsync(
    `INSERT INTO workout_sessions (name, program_id, started_at)
     VALUES (?, ?, ?)`,
    [name, programId ?? null, now],
  );
  const session = await db.getFirstAsync<WorkoutSession>(
    'SELECT * FROM workout_sessions WHERE id = ?',
    [result.lastInsertRowId],
  );
  if (!session) throw new Error('Failed to create session');
  return session;
}

export async function finishSession(id: number): Promise<void> {
  const db = getDatabase();
  const session = await db.getFirstAsync<{ started_at: number }>(
    'SELECT started_at FROM workout_sessions WHERE id = ?',
    [id],
  );
  if (!session) throw new Error('Session not found');

  const now = Math.floor(Date.now() / 1000);
  const duration = now - session.started_at;

  await db.runAsync(
    `UPDATE workout_sessions
     SET finished_at = ?, duration_seconds = ?
     WHERE id = ?`,
    [now, duration, id],
  );
}

export async function updateSessionNotes(id: number, notes: string): Promise<void> {
  const db = getDatabase();
  await db.runAsync(
    'UPDATE workout_sessions SET notes = ? WHERE id = ?',
    [notes, id],
  );
}

export async function deleteSession(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM workout_sessions WHERE id = ?', [id]);
}

export async function addSet(
  data: Omit<WorkoutSet, 'id' | 'created_at'>,
): Promise<WorkoutSet> {
  const db = getDatabase();
  const result = await db.runAsync(
    `INSERT INTO sets
       (session_id, exercise_id, set_number, reps, weight_kg,
        duration_seconds, distance_meters, rpe, is_warmup, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.session_id,
      data.exercise_id,
      data.set_number,
      data.reps ?? null,
      data.weight_kg ?? null,
      data.duration_seconds ?? null,
      data.distance_meters ?? null,
      data.rpe ?? null,
      data.is_warmup,
      data.notes ?? null,
    ],
  );
  const set = await db.getFirstAsync<WorkoutSet>(
    'SELECT * FROM sets WHERE id = ?',
    [result.lastInsertRowId],
  );
  if (!set) throw new Error('Failed to create set');
  return set;
}

export async function updateSet(
  id: number,
  data: Partial<Pick<WorkoutSet, 'reps' | 'weight_kg' | 'rpe' | 'notes' | 'is_warmup'>>,
): Promise<void> {
  const db = getDatabase();
  const fields = Object.entries(data)
    .filter(([, v]) => v !== undefined)
    .map(([k]) => `${k} = ?`);
  const values = Object.values(data).filter((v) => v !== undefined);

  if (fields.length === 0) return;

  await db.runAsync(
    `UPDATE sets SET ${fields.join(', ')} WHERE id = ?`,
    [...values, id],
  );
}

export async function deleteSet(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM sets WHERE id = ?', [id]);
}

export async function getVolumeSeries(
  exerciseId: number,
  limitDays = 90,
): Promise<{ date: string; volume: number }[]> {
  const db = getDatabase();
  const since = Math.floor(Date.now() / 1000) - limitDays * 86400;
  return db.getAllAsync<{ date: string; volume: number }>(
    `SELECT
       date(ws.started_at, 'unixepoch') AS date,
       SUM(s.reps * s.weight_kg)        AS volume
     FROM sets s
     JOIN workout_sessions ws ON ws.id = s.session_id
     WHERE s.exercise_id = ?
       AND ws.started_at >= ?
       AND s.is_warmup = 0
     GROUP BY date
     ORDER BY date ASC`,
    [exerciseId, since],
  );
}
