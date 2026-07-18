import api from './axios';

export const replyApi = {
  getAll: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/replies`);
    return response.data.data || response.data;
  },
  create: async (ticketId, data) => {
    const response = await api.post(`/tickets/${ticketId}/replies`, data);
    return response.data.data || response.data;
  }
};
