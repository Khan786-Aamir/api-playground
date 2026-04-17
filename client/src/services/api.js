import axios from 'axios';

const API = axios.create({
  baseURL: 'https://api-playground-backend-9mi1.onrender.com',
});

// Attach JWT to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Endpoints
export const getEndpoints = () => API.get('/endpoints');
export const createEndpoint = (data) => API.post('/endpoints', data);
export const deleteEndpoint = (id) => API.delete(`/endpoints/${id}`);
export const testEndpoint = (id) => API.post(`/endpoints/${id}/test`);

export default API;
