import { Banner } from '../types';
import axiosInstance from './axiosInstance';

export const bannersApi = {
  getBanners: async (): Promise<Banner[]> => {
    const response = await axiosInstance.get('/banners');
    return response.data;
  }
};
