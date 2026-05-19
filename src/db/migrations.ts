import { SQLiteDatabase } from 'expo-sqlite';

interface Migration {
  version: number;
  up: (db: SQLiteDatabase) => Promise<void>;
}

const migrations: Migration[] = [
  {
    version: 1,
    async up(db) {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS _migrations (
          version    INTEGER PRIMARY KEY,
          applied_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
        );
      `);
    },
  },
];

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version    INTEGER PRIMARY KEY,
      applied_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);

  const applied = await db.getAllAsync<{ version: number }>(
    'SELECT version FROM _migrations ORDER BY version ASC',
  );
  const appliedVersions = new Set(applied.map((r) => r.version));

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;

    await migration.up(db);
    await db.runAsync(
      'INSERT INTO _migrations (version) VALUES (?)',
      migration.version,
    );
  }
}
