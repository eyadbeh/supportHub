import api from './axios';

export const categoryApi = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data.data || response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data.data || response.data;
  },
  create: async (data) => {
    const response = await api.post('/admin/categories', data);
    return response.data.data || response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/admin/categories/${id}`);
  },
};
