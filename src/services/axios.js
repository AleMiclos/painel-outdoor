import axios from 'axios';

const api = axios.create({
  baseURL: 'https://outdoor-backend.onrender.com/', // Atualize com sua URL de backend
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
