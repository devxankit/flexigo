import { create } from 'zustand';

export const useAdminAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('admin_user')) || null,
  isAuthenticated: !!localStorage.getItem('admin_token'),
  token: localStorage.getItem('admin_token') || null,

  login: async (email, password) => {
    // Mock Admin Login Logic
    if (email === 'admin@flexigo.com' && password === 'flexigo_root') {
      const mockUser = { id: 'ROOT-01', name: 'Master Administrator', role: 'SuperAdmin', email };
      const mockToken = 'admin_jwt_889900';
      
      localStorage.setItem('admin_user', JSON.stringify(mockUser));
      localStorage.setItem('admin_token', mockToken);
      
      set({ user: mockUser, isAuthenticated: true, token: mockToken });
      return true;
    }
    return false;
  },

  logout: () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    set({ user: null, isAuthenticated: false, token: null });
  }
}));
