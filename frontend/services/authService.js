import api, { setToken, removeToken, setUser, getToken, getUser } from './api';

const authService = {
  // POST /api/auth/register
  register: async ({ name, phone, email, password }) => {
    const res = await api.post('/auth/register', { name, phone, email, password });
    if (res?.data?.token) {
      await setToken(res.data.token);
      await setUser(res.data.user);
    }
    return res;
  },

  // POST /api/auth/login
  login: async ({ phone, password }) => {
    const res = await api.post('/auth/login', { phone, password });
    if (res?.data?.token) {
      await setToken(res.data.token);
      await setUser(res.data.user);
    }
    return res;
  },

  // POST /api/auth/logout
  logout: async () => {
    try {
      await api.post('/auth/logout', {}, true);
    } catch {}
    await removeToken();
  },

  // GET /api/users/me
  getProfile: async () => {
    return await api.get('/users/me', true);
  },

  // PATCH /api/users/profile
  updateProfile: async (updates) => {
    return await api.patch('/users/profile', updates, true);
  },

  // PATCH /api/users/password
  changePassword: async ({ currentPassword, newPassword }) => {
    return await api.patch('/users/password', { currentPassword, newPassword }, true);
  },

  getToken,
  getUser,
};

export default authService;
