import axiosInstance from './axiosInstance';

export const subscriptionApi = {
  getSubscription: async () => {
    const response = await axiosInstance.get('/subscription');
    return response.data;
  },

  upgrade: async (plan: string) => {
    const response = await axiosInstance.post('/subscription/upgrade', { plan });
    return response.data;
  },
};
