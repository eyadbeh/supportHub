import api from './axios';

export const departmentApi = {
  getAll: async () => {
    const response = await api.get('/departments');
    return response.data.data || response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/admin/departments/${id}`);
    return response.data.data || response.data;
  },
  create: async (data) => {
    const response = await api.post('/admin/departments', data);
    return response.data.data || response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/admin/departments/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/admin/departments/${id}`);
  },
};
