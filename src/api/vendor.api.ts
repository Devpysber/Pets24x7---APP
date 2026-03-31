import axiosInstance from './axiosInstance';

export const vendorApi = {
  getStats: async (vendorId: string) => {
    const response = await axiosInstance.get(`/vendor/${vendorId}/stats`);
    return response.data;
  },
  getLeads: async (vendorId: string) => {
    const response = await axiosInstance.get(`/vendor/${vendorId}/leads`);
    return response.data.leads;
  },
  updateProfile: async (vendorId: string, data: any) => {
    const response = await axiosInstance.put(`/vendor/${vendorId}/profile`, data);
    return response.data;
  }
};
