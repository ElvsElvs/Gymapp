import { getDatabase } from '../db/database';
import type { BodyWeight } from '../types';

export async function getBodyWeightHistory(limit = 90): Promise<BodyWeight[]> {
  const db = getDatabase();
  return db.getAllAsync<BodyWeight>(
    `SELECT * FROM body_weight
     ORDER BY recorded_at DESC
     LIMIT ?`,
    [limit],
  );
}

export async function addBodyWeight(
  weight_kg: number,
  recorded_at?: number,
  notes?: string,
): Promise<BodyWeight> {
  const db = getDatabase();
  const ts = recorded_at ?? Math.floor(Date.now() / 1000);
  const result = await db.runAsync(
    'INSERT INTO body_weight (weight_kg, recorded_at, notes) VALUES (?, ?, ?)',
    [weight_kg, ts, notes ?? null],
  );
  const entry = await db.getFirstAsync<BodyWeight>(
    'SELECT * FROM body_weight WHERE id = ?',
    [result.lastInsertRowId],
  );
  if (!entry) throw new Error('Failed to create body weight entry');
  return entry;
}

export async function deleteBodyWeight(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM body_weight WHERE id = ?', [id]);
}

export async function getLatestBodyWeight(): Promise<BodyWeight | null> {
  const db = getDatabase();
  return db.getFirstAsync<BodyWeight>(
    'SELECT * FROM body_weight ORDER BY recorded_at DESC LIMIT 1',
  );
}
