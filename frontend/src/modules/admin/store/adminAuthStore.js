import { create } from 'zustand';
import api from '../../../lib/axios';


export const useAdminAuthStore = create((set) => ({
  user: (localStorage.getItem('admin_user') && localStorage.getItem('admin_user') !== 'undefined') ? JSON.parse(localStorage.getItem('admin_user')) : null,
  isAuthenticated: !!localStorage.getItem('admin_token') && localStorage.getItem('admin_token') !== 'undefined' && localStorage.getItem('admin_token') !== 'null',
  token: (localStorage.getItem('admin_token') === 'undefined' || localStorage.getItem('admin_token') === 'null') ? null : localStorage.getItem('admin_token'),

  login: async (email, password) => {
    try {
      const res = await api.post('/admin/login', { email, password });
      if (res.data.success) {
        const { token, admin } = res.data;
        
        localStorage.setItem('admin_user', JSON.stringify(admin));
        localStorage.setItem('admin_token', token);
        
        set({ user: admin, isAuthenticated: true, token });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
    set({ user: null, isAuthenticated: false, token: null });
  }
}));
