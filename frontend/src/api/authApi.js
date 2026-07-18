import api from './axios';

export const authApi = {
  /**
   * Register a new user.
   * @param {Object} data { name, email, password, password_confirmation }
   * @returns {Promise<Object>} { user, token }
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Authenticate a user.
   * @param {Object} data { email, password }
   * @returns {Promise<Object>} { user, token }
   */
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Log out the current user.
   * @returns {Promise<void>}
   */
  logout: async () => {
    await axiosInstance.post('/auth/logout');
  },

  /**
   * Get the current authenticated user's profile.
   * @returns {Promise<Object>} { user }
   */
  getMe: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
};
