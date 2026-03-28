import { LostFoundPost } from '../types';
import axiosInstance from './axiosInstance';

export const lostFoundApi = {
  getLostFoundPosts: async (): Promise<LostFoundPost[]> => {
    const response = await axiosInstance.get('/lost-found');
    return response.data;
  },

  createPost: async (post: Omit<LostFoundPost, 'id' | 'createdAt' | 'userName' | 'userImage'>): Promise<LostFoundPost> => {
    const response = await axiosInstance.post('/lost-found', post);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/lost-found/${id}`);
  }
};
