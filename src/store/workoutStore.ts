import { create } from 'zustand';
import type { WorkoutSession, WorkoutSet, Exercise, WorkoutSetWithExercise } from '../types';
import * as workoutService from '../services/workoutService';

interface ActiveSet {
  exerciseId: number;
  exerciseName: string;
  reps: string;
  weight: string;
  rpe: string;
}

interface WorkoutState {
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  activeSets: WorkoutSetWithExercise[];
  draftSet: ActiveSet;
  isLoading: boolean;
  error: string | null;

  loadSessions: () => Promise<void>;
  startSession: (name: string, programId?: number) => Promise<void>;
  finishSession: () => Promise<void>;
  discardSession: () => Promise<void>;
  setDraftSet: (data: Partial<ActiveSet>) => void;
  addSet: (exerciseId: number, exerciseName: string) => Promise<void>;
  deleteSet: (setId: number) => Promise<void>;
}

const DEFAULT_DRAFT: ActiveSet = {
  exerciseId: 0,
  exerciseName: '',
  reps: '',
  weight: '',
  rpe: '',
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  sessions: [],
  activeSession: null,
  activeSets: [],
  draftSet: DEFAULT_DRAFT,
  isLoading: false,
  error: null,

  async loadSessions() {
    set({ isLoading: true, error: null });
    try {
      const sessions = await workoutService.getRecentSessions();
      set({ sessions, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  async startSession(name, programId) {
    set({ isLoading: true, error: null });
    try {
      const session = await workoutService.startSession(name, programId);
      set({ activeSession: session, activeSets: [], isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  async finishSession() {
    const { activeSession } = get();
    if (!activeSession) return;
    try {
      await workoutService.finishSession(activeSession.id);
      await get().loadSessions();
      set({ activeSession: null, activeSets: [], draftSet: DEFAULT_DRAFT });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  async discardSession() {
    const { activeSession } = get();
    if (!activeSession) return;
    try {
      await workoutService.deleteSession(activeSession.id);
      set({ activeSession: null, activeSets: [], draftSet: DEFAULT_DRAFT });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  setDraftSet(data) {
    set((state) => ({ draftSet: { ...state.draftSet, ...data } }));
  },

  async addSet(exerciseId, exerciseName) {
    const { activeSession, activeSets, draftSet } = get();
    if (!activeSession) return;

    const setNumber = activeSets.filter((s) => s.exercise_id === exerciseId).length + 1;

    const newSet = await workoutService.addSet({
      session_id: activeSession.id,
      exercise_id: exerciseId,
      set_number: setNumber,
      reps: draftSet.reps ? parseInt(draftSet.reps, 10) : null,
      weight_kg: draftSet.weight ? parseFloat(draftSet.weight) : null,
      rpe: draftSet.rpe ? parseFloat(draftSet.rpe) : null,
      duration_seconds: null,
      distance_meters: null,
      is_warmup: 0,
      notes: null,
    });

    const withExercise: WorkoutSetWithExercise = {
      ...newSet,
      exercise_name: exerciseName,
      muscle_group: null,
    };

    set((state) => ({
      activeSets: [...state.activeSets, withExercise],
      draftSet: { ...DEFAULT_DRAFT, exerciseId, exerciseName },
    }));
  },

  async deleteSet(setId) {
    await workoutService.deleteSet(setId);
    set((state) => ({
      activeSets: state.activeSets.filter((s) => s.id !== setId),
    }));
  },
}));
