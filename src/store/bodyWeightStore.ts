import { create } from 'zustand';
import type { BodyWeight } from '../types';
import * as bodyWeightService from '../services/bodyWeightService';

interface BodyWeightState {
  entries: BodyWeight[];
  latest: BodyWeight | null;
  isLoading: boolean;
  error: string | null;

  loadHistory: () => Promise<void>;
  addEntry: (weight_kg: number, recorded_at?: number, notes?: string) => Promise<void>;
  deleteEntry: (id: number) => Promise<void>;
}

export const useBodyWeightStore = create<BodyWeightState>((set) => ({
  entries: [],
  latest: null,
  isLoading: false,
  error: null,

  async loadHistory() {
    set({ isLoading: true, error: null });
    try {
      const entries = await bodyWeightService.getBodyWeightHistory();
      const latest = entries[0] ?? null;
      set({ entries, latest, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  async addEntry(weight_kg, recorded_at, notes) {
    const entry = await bodyWeightService.addBodyWeight(weight_kg, recorded_at, notes);
    set((state) => ({
      entries: [entry, ...state.entries],
      latest: entry,
    }));
  },

  async deleteEntry(id) {
    await bodyWeightService.deleteBodyWeight(id);
    set((state) => {
      const entries = state.entries.filter((e) => e.id !== id);
      return { entries, latest: entries[0] ?? null };
    });
  },
}));
