import { PetService } from '../types';
import axiosInstance from './axiosInstance';

export const listingsApi = {
  getListings: async (params?: any): Promise<{ data: PetService[], meta: any }> => {
    const response = await axiosInstance.get('/listings', { params });
    return response.data;
  },

  getListingById: async (id: string): Promise<PetService | undefined> => {
    const response = await axiosInstance.get(`/listings/${id}`);
    return response.data;
  },

  createListing: async (service: Omit<PetService, 'id'>): Promise<PetService> => {
    const response = await axiosInstance.post('/listings', service);
    return response.data;
  },

  updateListing: async (id: string, service: Partial<PetService>): Promise<PetService> => {
    const response = await axiosInstance.patch(`/listings/${id}`, service);
    return response.data;
  },

  deleteListing: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/listings/${id}`);
  }
};
