export interface Program {
  id: number;
  name: string;
  description: string | null;
  created_at: number;
  updated_at: number;
}

export interface WorkoutSession {
  id: number;
  program_id: number | null;
  name: string;
  notes: string | null;
  started_at: number;
  finished_at: number | null;
  duration_seconds: number | null;
  created_at: number;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string | null;
  equipment: string | null;
  notes: string | null;
  created_at: number;
}

export interface WorkoutSet {
  id: number;
  session_id: number;
  exercise_id: number;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  duration_seconds: number | null;
  distance_meters: number | null;
  rpe: number | null;
  is_warmup: number;
  notes: string | null;
  created_at: number;
}

export interface BodyWeight {
  id: number;
  weight_kg: number;
  recorded_at: number;
  notes: string | null;
  created_at: number;
}

export interface WorkoutSetWithExercise extends WorkoutSet {
  exercise_name: string;
  muscle_group: string | null;
}

export interface SessionWithSets extends WorkoutSession {
  sets: WorkoutSetWithExercise[];
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'glutes'
  | 'core'
  | 'cardio'
  | 'full_body'
  | 'other';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'resistance_band'
  | 'other';

export interface VolumeDataPoint {
  date: string;
  volume: number;
}

export interface WeightDataPoint {
  date: string;
  weight: number;
}
