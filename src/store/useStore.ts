import { create } from 'zustand';
import { ModuleProgress } from '../types';

type Store = {
  progress: ModuleProgress[];
  totalStars: number;
  setModuleComplete: (moduleId: string, score: number) => void;
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
  resetProgress: () => void;
};

export const useStore = create<Store>((set, get) => ({
  progress: [],
  totalStars: 0,

  setModuleComplete: (moduleId, score) => {
    const existing = get().progress.find((p) => p.moduleId === moduleId);
    const newEntry: ModuleProgress = { moduleId, completed: true, score };

    set((state) => {
      const filtered = state.progress.filter((p) => p.moduleId !== moduleId);
      const newProgress = [...filtered, newEntry];
      const totalStars = newProgress.reduce((sum, p) => sum + p.score, 0);
      return { progress: newProgress, totalStars };
    });
  },

  getModuleProgress: (moduleId) => {
    return get().progress.find((p) => p.moduleId === moduleId);
  },

  resetProgress: () => set({ progress: [], totalStars: 0 }),
}));
