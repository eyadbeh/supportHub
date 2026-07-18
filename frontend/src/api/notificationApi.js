import api from './axios';

export const notificationApi = {
  getUnread: async () => {
    const response = await api.get('/notifications');
    return response.data.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  }
};
