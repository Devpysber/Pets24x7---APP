import { Inquiry } from '../store/useAppStore';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const leadsApi = {
  createLead: async (inquiry: Omit<Inquiry, 'id' | 'createdAt'>): Promise<Inquiry> => {
    await delay(1000);
    // In a real app, this would be:
    // const response = await axiosInstance.post('/leads', inquiry);
    // return response.data;
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `i${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    return newInquiry;
  },

  getLeads: async (): Promise<Inquiry[]> => {
    await delay(500);
    // In a real app, this would be:
    // const response = await axiosInstance.get('/leads');
    // return response.data;
    return [];
  },

  buyLeads: async (amount: number): Promise<number> => {
    await delay(1000);
    // In a real app, this would be:
    // const response = await axiosInstance.post('/leads/buy', { amount });
    // return response.data.newBalance;
    return amount;
  }
};
