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
  login: async ({ phone, email, password }) => {
    const res = await api.post('/auth/login', { phone, email, password });
    if (res?.data?.token) {
      await setToken(res.data.token);
      await setUser(res.data.user);
    }
    return res;
  },

  // POST /api/auth/logout
  logout: async () => {
    try {
      await api.post('/auth/logout', {}, false);
    } catch {}
    await removeToken();
    await setUser(null);
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

  // POST /api/auth/send-otp (Powered by Firebase Cloud Messaging - FCM)
  sendOtp: async ({ phone, email, purpose = 'login', deviceToken = null }) => {
    return await api.post('/auth/send-otp', { phone, email, purpose, deviceToken }, false);
  },

  // POST /api/auth/verify-otp (Authenticates user with signed JWT token)
  verifyOtp: async ({ phone, email, otp, newPassword }) => {
    const res = await api.post('/auth/verify-otp', { phone, email, otp, newPassword }, false);
    if (res?.data?.token) {
      await setToken(res.data.token);
      await setUser(res.data.user);
    }
    return res;
  },

  // POST /api/auth/reset-password
  resetPassword: async ({ phone, email, otp, newPassword, confirmPassword }) => {
    return await api.post('/auth/reset-password', { phone, email, otp, newPassword, confirmPassword }, false);
  },

  getToken,
  getUser,
};



export default authService;

