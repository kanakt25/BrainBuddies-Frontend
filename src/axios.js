// src/axios.js
import api from '../axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ Adjust if needed
});

// Automatically add token to every request if available
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized, redirecting or logging out...');
      // Optionally remove token and redirect to login
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login'; // or use navigate() if inside component
    }
    return Promise.reject(error);
  }
);

export default api;
