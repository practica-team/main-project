import { storage } from '@shared';
import axios from 'axios';

export const $api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

$api.interceptors.request.use((config) => {
    const token = storage.getToken();
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

$api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            storage.removeToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);