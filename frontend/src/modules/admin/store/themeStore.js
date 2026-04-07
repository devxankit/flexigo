import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark', // Master root default is dark
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return { theme: newTheme };
      }),
      setTheme: (theme) => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        set({ theme });
      },
    }),
    {
      name: 'admin-theme-storage',
    }
  )
);
