// ============================================================
// SmartTrip API Base Client
// ============================================================
// Change this to your machine's local IP when testing on
// a physical device (e.g., 'http://192.168.1.5:5000').
// For Android emulator use 'http://10.0.2.2:5000'.
// For iOS simulator / web use 'http://localhost:5000'.
// ============================================================
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Determine appropriate API host based on execution environment
const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return `http://${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseUrl();

// Safe storage wrapper (supports AsyncStorage, Web localStorage, and in-memory fallback)
const memoryStorage = new Map();

const safeStorage = {
  getItem: async (key) => {
    try {
      if (AsyncStorage?.getItem) {
        const val = await AsyncStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      }
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      }
    } catch {}
    return memoryStorage.get(key) || null;
  },
  setItem: async (key, val) => {
    try {
      if (AsyncStorage?.setItem) await AsyncStorage.setItem(key, val);
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, val);
    } catch {}
    memoryStorage.set(key, val);
  },
  removeItem: async (key) => {
    try {
      if (AsyncStorage?.removeItem) await AsyncStorage.removeItem(key);
    } catch {}
    try {
      if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem(key);
    } catch {}
    memoryStorage.delete(key);
  },
};

// -------------------------------------------------------
// Token helpers (stored safely)
// -------------------------------------------------------
export const getToken = async () => {
  return await safeStorage.getItem('@smarttrip_token');
};

export const setToken = async (token) => {
  await safeStorage.setItem('@smarttrip_token', token);
};

export const removeToken = async () => {
  await safeStorage.removeItem('@smarttrip_token');
  await safeStorage.removeItem('@smarttrip_user');
};

export const setUser = async (user) => {
  await safeStorage.setItem('@smarttrip_user', JSON.stringify(user));
};

export const getUser = async () => {
  try {
    const val = await safeStorage.getItem('@smarttrip_user');
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
};

// -------------------------------------------------------
// Core fetch wrapper
// -------------------------------------------------------
const request = async (method, endpoint, body = null, requiresAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };

  if (requiresAuth) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data?.message || 'Request failed');
      error.statusCode = response.status;
      error.errorCode = data?.errorCode;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.statusCode) throw error;
    // Network error
    const netErr = new Error('Network error — please check your connection');
    netErr.statusCode = 0;
    throw netErr;
  }
};

// -------------------------------------------------------
// Exported HTTP methods
// -------------------------------------------------------
export const api = {
  get: (endpoint, auth = false) => request('GET', endpoint, null, auth),
  post: (endpoint, body, auth = false) => request('POST', endpoint, body, auth),
  patch: (endpoint, body, auth = false) => request('PATCH', endpoint, body, auth),
  put: (endpoint, body, auth = false) => request('PUT', endpoint, body, auth),
  delete: (endpoint, auth = false) => request('DELETE', endpoint, null, auth),
};

export default api;
