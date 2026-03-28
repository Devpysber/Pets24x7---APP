import { User } from '../types';
import axiosInstance from './axiosInstance';

export const userApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (user: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put('/user/profile', user);
    return response.data;
  }
};
