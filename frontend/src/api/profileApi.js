import api from './axios';

export const profileApi = {
  get: async () => {
    const response = await api.get('/profile');
    return response.data.data || response.data;
  },
  update: async (formData) => {
    const response = await api.post('/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
