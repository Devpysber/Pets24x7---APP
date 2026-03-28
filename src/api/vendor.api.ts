import axiosInstance from './axiosInstance';

export const vendorApi = {
  getStats: async (vendorId: string) => {
    const response = await axiosInstance.get(`/vendor/${vendorId}/stats`);
    return response.data;
  },
  getLeads: async (vendorId: string) => {
    const response = await axiosInstance.get(`/vendor/${vendorId}/leads`);
    return response.data.leads;
  }
};
