import { create } from 'zustand';
import { ModuleProgress } from '../types';

type Store = {
  user: string | null;
  progress: ModuleProgress[];
  totalStars: number;
  setUser: (username: string) => void;
  logout: () => void;
  setModuleComplete: (moduleId: string, score: number) => void;
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
};

export const useStore = create<Store>((set, get) => ({
  user: null,
  progress: [],
  totalStars: 0,

  setUser: (username) => set({ user: username }),

  logout: () => set({ user: null, progress: [], totalStars: 0 }),

  setModuleComplete: (moduleId, score) => {
    set((state) => {
      const filtered = state.progress.filter((p) => p.moduleId !== moduleId);
      const newProgress = [...filtered, { moduleId, completed: true, score }];
      const totalStars = newProgress.reduce((sum, p) => sum + p.score, 0);
      return { progress: newProgress, totalStars };
    });
  },

  getModuleProgress: (moduleId) => {
    return get().progress.find((p) => p.moduleId === moduleId);
  },
}));
