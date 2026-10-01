import apiClient from './client';

export const getEvents = () => apiClient.get('/events');
export const getEventById = (id) => apiClient.get(`/events/${id}`);
export const createEvent = (formData) =>
  apiClient.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateEvent = (id, formData) =>
  apiClient.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteEvent = (id) => apiClient.delete(`/events/${id}`);
