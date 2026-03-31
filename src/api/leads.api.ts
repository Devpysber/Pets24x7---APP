import { Inquiry } from '../types';
import axiosInstance from './axiosInstance';

export const leadsApi = {
  createLead: async (leadData: { 
    vendorId: string; 
    listingId?: string; 
    actionType: 'CALL' | 'WHATSAPP' | 'INQUIRY'; 
    message?: string;
  }): Promise<any> => {
    const response = await axiosInstance.post('/lead', leadData);
    return response.data;
  },

  getVendorLeads: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/vendor/leads');
    return response.data;
  },

  getUserLeads: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/leads/user');
    return response.data;
  },

  getLeadsByVendorId: async (vendorId: string): Promise<any[]> => {
    const response = await axiosInstance.get(`/leads/vendor/${vendorId}`);
    return response.data;
  },

  updateLeadStatus: async (id: string, status: string): Promise<any> => {
    const response = await axiosInstance.patch(`/lead/${id}/status`, { status });
    return response.data;
  },

  buyLeads: async (vendorId: string, amount: number): Promise<number> => {
    const response = await axiosInstance.post('/leads/buy', { vendorId, amount });
    return response.data.newBalance;
  }
};
