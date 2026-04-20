import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    // Try to get token from franchise or rider auth stores in localStorage
    const franchiseAuth = localStorage.getItem('franchise-auth');
    if (franchiseAuth) {
      const { state } = JSON.parse(franchiseAuth);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
        return config;
      }
    }

    const riderAuth = localStorage.getItem('rider-auth');
    if (riderAuth) {
      const { state } = JSON.parse(riderAuth);
      if (state.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
