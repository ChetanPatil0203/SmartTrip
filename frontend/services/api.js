// ============================================================
// SmartTrip API Base Client
// ============================================================
// Change this to your machine's local IP when testing on
// a physical device (e.g., 'http://192.168.1.5:5000').
// For Android emulator use 'http://10.0.2.2:5000'.
// For iOS simulator / web use 'http://localhost:5000'.
// ============================================================
import { Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_LAN_IP = '10.40.25.170';

// Automatically detect host IP (works on Web, Android Emulator, iOS Simulator, and Physical Devices over Expo LAN)
const getHostAddress = () => {
  // 1. Web browser
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return window.location.hostname;
  }
  // 2. Metro packager bundle URL (gives real Wi-Fi LAN IP e.g. 192.168.x.x or 10.x.x.x on real phones)
  const scriptURL = NativeModules?.SourceCode?.scriptURL;
  if (scriptURL) {
    const match = scriptURL.match(/^https?:\/\/([^:/]+)/);
    if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
      return match[1];
    }
  }
  // 3. Physical phone on Expo Go / Wi-Fi fallback (uses machine Wi-Fi IP so phone connects to PC backend)
  return DEV_LAN_IP;
};

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const host = getHostAddress();
  return `http://${host}:5000/api`;
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
// Core fetch wrapper with 4.5s Timeout and Fast Retry
// -------------------------------------------------------
const TIMEOUT_MS = 4500;

const fetchWithTimeout = async (url, options, timeout = TIMEOUT_MS) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      const timeoutErr = new Error('Connection timed out. Please check your network and try again.');
      timeoutErr.statusCode = 408;
      throw timeoutErr;
    }
    throw error;
  }
};

const request = async (method, endpoint, body = null, requiresAuth = false, retries = 1) => {
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

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, config);
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
      if (error.statusCode && error.statusCode !== 408 && error.statusCode >= 400 && error.statusCode < 500) {
        // Client errors (400, 401, 403, 404, etc.) shouldn't be retried
        throw error;
      }

      attempt++;
      if (attempt > retries) {
        if (error.statusCode) throw error;
        const netErr = new Error('Network error — please check your internet connection and ensure backend is running.');
        netErr.statusCode = 0;
        throw netErr;
      }
      // Exponential backoff before retry (e.g. 500ms, 1000ms)
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
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
