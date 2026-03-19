import { PetService } from '../types';
import { mockServices } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const listingsApi = {
  getListings: async (): Promise<PetService[]> => {
    await delay(500);
    // In a real app, this would be:
    // const response = await axiosInstance.get('/listings');
    // return response.data;
    return [...mockServices];
  },

  getListingById: async (id: string): Promise<PetService | undefined> => {
    await delay(300);
    // In a real app, this would be:
    // const response = await axiosInstance.get(`/listings/${id}`);
    // return response.data;
    return mockServices.find(s => s.id === id);
  },

  createListing: async (service: Omit<PetService, 'id'>): Promise<PetService> => {
    await delay(800);
    const newService = { ...service, id: `s${Date.now()}` };
    // In a real app, this would be:
    // const response = await axiosInstance.post('/listings', service);
    // return response.data;
    return newService;
  },

  updateListing: async (id: string, service: Partial<PetService>): Promise<PetService> => {
    await delay(500);
    const existing = mockServices.find(s => s.id === id);
    if (!existing) throw new Error('Listing not found');
    return { ...existing, ...service };
  },

  deleteListing: async (id: string): Promise<void> => {
    await delay(500);
    // In a real app, this would be:
    // await axiosInstance.delete(`/listings/${id}`);
  }
};
