import { getDatabase } from '../db/database';
import type { Program } from '../types';

export async function getAllPrograms(): Promise<Program[]> {
  const db = getDatabase();
  return db.getAllAsync<Program>(
    'SELECT * FROM programs ORDER BY updated_at DESC',
  );
}

export async function getProgramById(id: number): Promise<Program | null> {
  const db = getDatabase();
  return db.getFirstAsync<Program>(
    'SELECT * FROM programs WHERE id = ?',
    [id],
  );
}

export async function createProgram(
  name: string,
  description?: string,
): Promise<Program> {
  const db = getDatabase();
  const result = await db.runAsync(
    'INSERT INTO programs (name, description) VALUES (?, ?)',
    [name, description ?? null],
  );
  const program = await db.getFirstAsync<Program>(
    'SELECT * FROM programs WHERE id = ?',
    [result.lastInsertRowId],
  );
  if (!program) throw new Error('Failed to create program');
  return program;
}

export async function updateProgram(
  id: number,
  data: Partial<Pick<Program, 'name' | 'description'>>,
): Promise<void> {
  const db = getDatabase();
  const now = Math.floor(Date.now() / 1000);
  await db.runAsync(
    `UPDATE programs
     SET name = COALESCE(?, name),
         description = COALESCE(?, description),
         updated_at = ?
     WHERE id = ?`,
    [data.name ?? null, data.description ?? null, now, id],
  );
}

export async function deleteProgram(id: number): Promise<void> {
  const db = getDatabase();
  await db.runAsync('DELETE FROM programs WHERE id = ?', [id]);
}
