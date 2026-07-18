import api from './axios';

export const ticketApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/tickets?${params}`);
    return response.data.data || response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data.data || response.data;
  },
  create: async (data) => {
    const response = await api.post('/tickets', data);
    return response.data.data || response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data.data || response.data;
  },
  getActivities: async (id) => {
    const response = await api.get(`/tickets/${id}/activities`);
    return response.data.data || response.data;
  }
};
