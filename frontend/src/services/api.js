import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const initialToken = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

export const api = axios.create({
  baseURL: API_URL,
});

if (initialToken) {
  api.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401 && typeof message === 'string' && message.toLowerCase().includes('unauthorized')) {
      error.response.data.message = 'Session expired. Please log in again.';
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
