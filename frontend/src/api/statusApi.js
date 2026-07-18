import api from './axios';

export const statusApi = {
  getAll: async () => {
    const response = await api.get('/statuses');
    return response.data.data || response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/admin/statuses/${id}`);
    return response.data.data || response.data;
  },
  create: async (data) => {
    const response = await api.post('/admin/statuses', data);
    return response.data.data || response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/admin/statuses/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/admin/statuses/${id}`);
  },
};
