import api from './axios';

export const dashboardApi = {
  getOverview: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
};
