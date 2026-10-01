import { API_BASE_URL } from '../api/client';

export const resolveMediaUrl = (path?: string) => {
  if (!path) {
    return '';
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${API_BASE_URL.replace('/api', '')}${path}`;
};
