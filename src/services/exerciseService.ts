import { getDatabase } from '../db/database';
import type { Exercise } from '../types';

export async function getAllExercises(): Promise<Exercise[]> {
  const db = getDatabase();
  return db.getAllAsync<Exercise>(
    'SELECT * FROM exercises ORDER BY name ASC',
  );
}

export async function searchExercises(query: string): Promise<Exercise[]> {
  const db = getDatabase();
  return db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE name LIKE ? ORDER BY name ASC',
    [`%${query}%`],
  );
}

export async function getExercisesByMuscle(muscle: string): Promise<Exercise[]> {
  const db = getDatabase();
  return db.getAllAsync<Exercise>(
    'SELECT * FROM exercises WHERE muscle_group = ? ORDER BY name ASC',
    [muscle],
  );
}

export async function createExercise(
  data: Omit<Exercise, 'id' | 'created_at'>,
): Promise<Exercise> {
  const db = getDatabase();
  const result = await db.runAsync(
    `INSERT INTO exercises (name, muscle_group, equipment, notes)
     VALUES (?, ?, ?, ?)`,
    [data.name, data.muscle_group ?? null, data.equipment ?? null, data.notes ?? null],
  );
  const created = await db.getFirstAsync<Exercise>(
    'SELECT * FROM exercises WHERE id = ?',
    [result.lastInsertRowId],
  );
  if (!created) throw new Error('Failed to fetch created exercise');
  return created;
}

export async function deleteExercise(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM exercises WHERE id = ?', [id]);
}
