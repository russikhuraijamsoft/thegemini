import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  branchId: string | null;
  setBranchId: (id: string | null) => void;
  isOfflineMode: boolean;
  setOfflineMode: (offline: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      branchId: null,
      setBranchId: (branchId) => set({ branchId }),
      // Store initialization also runs during SSR and in Node-based tests,
      // where the browser's navigator global is unavailable.
      isOfflineMode: typeof navigator !== 'undefined' && !navigator.onLine,
      setOfflineMode: (isOfflineMode) => set({ isOfflineMode }),
    }),
    {
      name: 'talkos-app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
