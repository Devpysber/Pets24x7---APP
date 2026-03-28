import { Inquiry } from '../types';
import axiosInstance from './axiosInstance';

export const leadsApi = {
  createLead: async (inquiry: Omit<Inquiry, 'id' | 'createdAt'>): Promise<Inquiry> => {
    const response = await axiosInstance.post('/leads', inquiry);
    return response.data;
  },

  getLeads: async (vendorId: string): Promise<Inquiry[]> => {
    const response = await axiosInstance.get(`/leads/vendor/${vendorId}`);
    return response.data.leads;
  },

  updateLeadStatus: async (id: string, status: string): Promise<void> => {
    await axiosInstance.patch(`/leads/${id}/status`, { status });
  },

  buyLeads: async (vendorId: string, amount: number): Promise<number> => {
    const response = await axiosInstance.post('/leads/buy', { vendorId, amount });
    return response.data.newBalance;
  }
};
