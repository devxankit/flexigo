import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5100/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    // 1. Check URL to decide token priority
    const isAdminRoute = config.url?.includes('/admin');

    // If it's an admin route, prioritize admin_token
    if (isAdminRoute) {
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken && adminToken !== 'undefined' && adminToken !== 'null') {
        config.headers.Authorization = `Bearer ${adminToken}`;
        return config;
      }
    }

    // Try to get token from franchise or rider auth stores
    const franchiseAuth = localStorage.getItem('franchise-auth');
    if (franchiseAuth && franchiseAuth !== 'undefined') {
      const { state } = JSON.parse(franchiseAuth);
      if (state.token && state.token !== 'undefined' && state.token !== 'null') {
        config.headers.Authorization = `Bearer ${state.token}`;
        return config;
      }
    }

    const riderAuth = localStorage.getItem('rider-auth');
    if (riderAuth && riderAuth !== 'undefined') {
      const { state } = JSON.parse(riderAuth);
      if (state.token && state.token !== 'undefined' && state.token !== 'null') {
        config.headers.Authorization = `Bearer ${state.token}`;
        return config;
      }
    }

    // Fallback for admin if not already handled (for non-explicit admin routes)
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken && adminToken !== 'undefined' && adminToken !== 'null') {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
