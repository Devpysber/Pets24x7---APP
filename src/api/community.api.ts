import { CommunityPost, CommunityComment } from '../types';
import axiosInstance from './axiosInstance';

export const communityApi = {
  getPosts: async (): Promise<CommunityPost[]> => {
    const response = await axiosInstance.get('/community');
    return response.data;
  },

  createPost: async (post: Omit<CommunityPost, 'id' | 'createdAt' | 'userName' | 'userImage' | 'userId' | 'likes' | 'comments'>): Promise<CommunityPost> => {
    const response = await axiosInstance.post('/community', post);
    return response.data;
  },

  updatePost: async (id: string, post: Partial<CommunityPost>): Promise<CommunityPost> => {
    const response = await axiosInstance.patch(`/community/${id}`, post);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/community/${id}`);
  },

  toggleLike: async (postId: string): Promise<{ likes: string[] }> => {
    const response = await axiosInstance.post(`/community/${postId}/like`);
    return response.data;
  },

  addComment: async (postId: string, text: string): Promise<CommunityComment> => {
    const response = await axiosInstance.post(`/community/${postId}/comments`, { text });
    return response.data;
  }
};
