export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS programs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    description TEXT,
    created_at  INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
    updated_at  INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT    NOT NULL UNIQUE,
    muscle_group TEXT,
    equipment    TEXT,
    notes        TEXT,
    created_at   INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS workout_sessions (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    program_id       INTEGER REFERENCES programs(id) ON DELETE SET NULL,
    name             TEXT    NOT NULL,
    notes            TEXT,
    started_at       INTEGER NOT NULL,
    finished_at      INTEGER,
    duration_seconds INTEGER,
    created_at       INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS sets (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id       INTEGER NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id      INTEGER NOT NULL REFERENCES exercises(id),
    set_number       INTEGER NOT NULL,
    reps             INTEGER,
    weight_kg        REAL,
    duration_seconds INTEGER,
    distance_meters  REAL,
    rpe              REAL,
    is_warmup        INTEGER NOT NULL DEFAULT 0,
    notes            TEXT,
    created_at       INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );

  CREATE TABLE IF NOT EXISTS body_weight (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    weight_kg   REAL    NOT NULL,
    recorded_at INTEGER NOT NULL,
    notes       TEXT,
    created_at  INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_program    ON workout_sessions(program_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON workout_sessions(started_at);
  CREATE INDEX IF NOT EXISTS idx_sets_session        ON sets(session_id);
  CREATE INDEX IF NOT EXISTS idx_sets_exercise       ON sets(exercise_id);
  CREATE INDEX IF NOT EXISTS idx_body_weight_date    ON body_weight(recorded_at);
`;

export const SEED_EXERCISES_SQL = `
  INSERT OR IGNORE INTO exercises (name, muscle_group, equipment) VALUES
    ('Bench Press',          'chest',     'barbell'),
    ('Incline Bench Press',  'chest',     'barbell'),
    ('Dumbbell Fly',         'chest',     'dumbbell'),
    ('Push-Up',              'chest',     'bodyweight'),
    ('Pull-Up',              'back',      'bodyweight'),
    ('Barbell Row',          'back',      'barbell'),
    ('Lat Pulldown',         'back',      'cable'),
    ('Deadlift',             'back',      'barbell'),
    ('Overhead Press',       'shoulders', 'barbell'),
    ('Lateral Raise',        'shoulders', 'dumbbell'),
    ('Face Pull',            'shoulders', 'cable'),
    ('Barbell Curl',         'biceps',    'barbell'),
    ('Dumbbell Curl',        'biceps',    'dumbbell'),
    ('Hammer Curl',          'biceps',    'dumbbell'),
    ('Tricep Pushdown',      'triceps',   'cable'),
    ('Skull Crusher',        'triceps',   'barbell'),
    ('Squat',                'legs',      'barbell'),
    ('Romanian Deadlift',    'legs',      'barbell'),
    ('Leg Press',            'legs',      'machine'),
    ('Leg Curl',             'legs',      'machine'),
    ('Hip Thrust',           'glutes',    'barbell'),
    ('Glute Bridge',         'glutes',    'bodyweight'),
    ('Plank',                'core',      'bodyweight'),
    ('Cable Crunch',         'core',      'cable'),
    ('Running',              'cardio',    'other');
`;
