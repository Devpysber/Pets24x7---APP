import { User } from '../types';
import { mockUser } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userApi = {
  login: async (email: string, pass: string): Promise<User> => {
    await delay(1000);
    // In a real app, this would be:
    // const response = await axiosInstance.post('/auth/login', { email, pass });
    // return response.data;
    if (email === mockUser.email) {
      return { ...mockUser };
    }
    throw new Error('Invalid credentials');
  },

  getProfile: async (): Promise<User> => {
    await delay(500);
    // In a real app, this would be:
    // const response = await axiosInstance.get('/user/profile');
    // return response.data;
    return { ...mockUser };
  },

  updateProfile: async (user: Partial<User>): Promise<User> => {
    await delay(800);
    // In a real app, this would be:
    // const response = await axiosInstance.put('/user/profile', user);
    // return response.data;
    return { ...mockUser, ...user };
  }
};
