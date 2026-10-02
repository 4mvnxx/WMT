import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = 'http://192.168.100.148:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export default apiClient;
