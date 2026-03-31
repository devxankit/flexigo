import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFranchiseAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null, // { id: 'F-001', name: 'Vivek Sharma', role: 'Partner', hub: 'FlexiHub Koramangala' }
      role: null, // Partner | Manager | Attendant
      hubId: 'HUB-KOR-01',

      login: (credentials) => {
        // Mock login
        const mockUser = {
          id: 'F-001',
          name: 'Vivek Sharma',
          role: credentials.role || 'Partner',
          hub: 'FlexiHub Koramangala',
        };
        set({ isAuthenticated: true, user: mockUser, role: mockUser.role });
      },

      logout: () => set({ isAuthenticated: false, user: null, role: null }),
    }),
    { name: 'franchise-auth' }
  )
);
