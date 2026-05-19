export interface WorkoutSession {
  id: number;
  name: string;
  date: string;
  notes?: string;
  created_at: string;
}

export interface Exercise {
  id: number;
  session_id: number;
  name: string;
  order_index: number;
}

export interface Set {
  id: number;
  exercise_id: number;
  reps: number;
  weight_kg: number;
  set_number: number;
}

export interface BodyWeightEntry {
  id: number;
  date: string;
  weight_kg: number;
  notes?: string;
}

export interface ProgramGroup {
  name: string;
  exercises: string[];
}

export interface Program {
  id: string;
  name: string;
  groups: ProgramGroup[];
}
