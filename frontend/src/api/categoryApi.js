import axiosInstance from './axios';

export const categoryApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/admin/categories');
    return response.data.data || response.data;
  },
  getOne: async (id) => {
    const response = await axiosInstance.get(`/admin/categories/${id}`);
    return response.data.data || response.data;
  },
  create: async (data) => {
    const response = await axiosInstance.post('/admin/categories', data);
    return response.data.data || response.data;
  },
  update: async (id, data) => {
    const response = await axiosInstance.put(`/admin/categories/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/admin/categories/${id}`);
  },
};
