import axios from 'axios';
import { storage } from '../utils/storage';

// Override for local dev, e.g. EXPO_PUBLIC_API_URL=http://192.168.x.x:5000/api
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://wmt-vkab.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await storage.getItem('token');

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default apiClient;
