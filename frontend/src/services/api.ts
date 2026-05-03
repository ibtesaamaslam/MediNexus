import axios from 'axios';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthService = {
  login: (creds: any) => api.post('/auth/login', creds),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export const PatientService = {
  getAll: () => api.get('/patients'),
  getOne: (id: string) => api.get(`/patients/${id}`),
  create: (data: any) => api.post('/patients', data),
  update: (id: string, data: any) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
  uploadDocument: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/patients/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const ApptService = {
  getAll: () => api.get('/appointments'),
  create: (data: any) => api.post('/appointments', data),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data)
};

export const BillingService = {
  getAll: () => api.get('/billing'),
  create: (data: any) => api.post('/billing', data)
};

export const AIService = {
  summarize: (notes: string) => api.post('/ai/summarize', { notes })
};

export const AnalyticsService = {
  getDaily: () => api.get('/analytics/daily')
};