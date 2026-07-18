import api from './axios';

export const userApi = {
  getAll: async () => {
    const response = await api.get('/admin/users');
    return response.data.data || response.data;
  },
  create: async (data) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },
  updateRole: async (id, data) => {
    const response = await api.put(`/admin/users/${id}/role`, data);
    return response.data;
  },
  disable: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  enable: async (id) => {
    const response = await api.post(`/admin/users/${id}/restore`);
    return response.data;
  },
};
