import axiosInstance from './axios';

export const departmentApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/admin/departments');
    return response.data.data || response.data;
  },
  getOne: async (id) => {
    const response = await axiosInstance.get(`/admin/departments/${id}`);
    return response.data.data || response.data;
  },
  create: async (data) => {
    const response = await axiosInstance.post('/admin/departments', data);
    return response.data.data || response.data;
  },
  update: async (id, data) => {
    const response = await axiosInstance.put(`/admin/departments/${id}`, data);
    return response.data.data || response.data;
  },
  delete: async (id) => {
    await axiosInstance.delete(`/admin/departments/${id}`);
  },
};
