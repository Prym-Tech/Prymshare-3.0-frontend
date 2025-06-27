import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Atom for the JWT access token. Synced with localStorage for persistence.
export const authTokenAtom = atomWithStorage('prymshare_token', null);

// Atom for the user object.
export const userAtom = atomWithStorage('prymshare_user', null);

// A derived atom to quickly check for authentication status.
export const isAuthenticatedAtom = atom(get => get(authTokenAtom) !== null);


// ================================================================================
// 4. CENTRALIZED API CLIENT: /src/lib/api.js
// ================================================================================
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request if it exists.
apiClient.interceptors.request.use(
  config => {
    // Jotai's atomWithStorage stores the value in localStorage.
    const tokenString = localStorage.getItem('prymshare_token');
    if (tokenString) {
      // The value is stored as a JSON string (e.g., '"your_token"'), so we parse it.
      const token = JSON.parse(tokenString);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;