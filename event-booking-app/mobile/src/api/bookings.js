import apiClient from './client';

export const getMyBookings = () => apiClient.get('/bookings/my');
export const getAllBookings = () => apiClient.get('/bookings');
export const createBooking = (eventId, quantity) =>
  apiClient.post('/bookings', { eventId, quantity });

export const cancelBooking = (id) => apiClient.delete(`/bookings/${id}`);
export const updateBookingStatus = (id, status) =>
  apiClient.put(`/bookings/${id}/status`, { status });
export const approveBooking = (id) => apiClient.put(`/bookings/${id}/approve`);
export const rejectBooking = (id) => apiClient.put(`/bookings/${id}/reject`, { status: 'Rejected' });

export const deleteBooking = (id) => apiClient.delete(`/bookings/${id}`);
