import { Notification } from '../types';
import axiosInstance from './axiosInstance';

export const notificationsApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.post('/notifications/read-all');
  },

  clearAll: async (): Promise<void> => {
    await axiosInstance.delete('/notifications');
  }
};
