import { LostFoundPost } from '../types';
import { mockLostFoundPosts } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const lostFoundApi = {
  getLostFoundPosts: async (): Promise<LostFoundPost[]> => {
    await delay(500);
    // In a real app, this would be:
    // const response = await axiosInstance.get('/lost-found');
    // return response.data;
    return [...mockLostFoundPosts];
  },

  createPost: async (post: Omit<LostFoundPost, 'id' | 'createdAt' | 'userName' | 'userImage'>): Promise<LostFoundPost> => {
    await delay(1000);
    // In a real app, this would be:
    // const response = await axiosInstance.post('/lost-found', post);
    // return response.data;
    const newPost: LostFoundPost = {
      ...post,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
      userName: 'Antriksh Shah',
      userImage: 'https://picsum.photos/seed/user1/100/100'
    };
    return newPost;
  },

  deletePost: async (id: string): Promise<void> => {
    await delay(500);
    // In a real app, this would be:
    // await axiosInstance.delete(`/lost-found/${id}`);
  }
};
