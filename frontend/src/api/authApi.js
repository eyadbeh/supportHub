import api from './axios';

export const authApi = {
  /**
   * Initialize CSRF protection for Sanctum SPA Auth.
   */
  initCsrf: async () => {
    await api.get('/sanctum/csrf-cookie', { baseURL: '' });
  },

  /**
   * Register a new user.
   * @param {Object} data { name, email, password, password_confirmation }
   * @returns {Promise<Object>} { user }
   */
  register: async (data) => {
    await authApi.initCsrf();
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Authenticate a user via session.
   * @param {Object} data { email, password }
   * @returns {Promise<Object>} { user }
   */
  login: async (data) => {
    await authApi.initCsrf();
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Log out the current user and destroy session.
   * @returns {Promise<void>}
   */
  logout: async () => {
    await api.post('/auth/logout');
  },

  /**
   * Get the current authenticated user's profile.
   * @returns {Promise<Object>} { user }
   */
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
