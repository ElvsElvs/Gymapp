export interface WorkoutSession {
  id: number;
  name: string;
  started_at: number;
  finished_at: number | null;
  duration_seconds: number | null;
  notes: string | null;
}

export interface Exercise {
  id: number;
  name: string;
  muscle_group: string | null;
  equipment: string | null;
}

export interface Set {
  id: number;
  session_id: number;
  exercise_id: number;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  rpe: number | null;
}

export interface BodyWeightEntry {
  id: number;
  weight_kg: number;
  recorded_at: number;
  notes: string | null;
}
