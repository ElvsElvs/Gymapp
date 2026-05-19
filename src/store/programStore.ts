import { create } from 'zustand';
import type { Program } from '../types';
import * as programService from '../services/programService';

interface ProgramState {
  programs: Program[];
  isLoading: boolean;
  error: string | null;

  loadPrograms: () => Promise<void>;
  createProgram: (name: string, description?: string) => Promise<Program>;
  updateProgram: (id: number, data: Partial<Pick<Program, 'name' | 'description'>>) => Promise<void>;
  deleteProgram: (id: number) => Promise<void>;
}

export const useProgramStore = create<ProgramState>((set, get) => ({
  programs: [],
  isLoading: false,
  error: null,

  async loadPrograms() {
    set({ isLoading: true, error: null });
    try {
      const programs = await programService.getAllPrograms();
      set({ programs, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  async createProgram(name, description) {
    const program = await programService.createProgram(name, description);
    set((state) => ({ programs: [program, ...state.programs] }));
    return program;
  },

  async updateProgram(id, data) {
    await programService.updateProgram(id, data);
    set((state) => ({
      programs: state.programs.map((p) =>
        p.id === id ? { ...p, ...data } : p,
      ),
    }));
  },

  async deleteProgram(id) {
    await programService.deleteProgram(id);
    set((state) => ({
      programs: state.programs.filter((p) => p.id !== id),
    }));
  },
}));
