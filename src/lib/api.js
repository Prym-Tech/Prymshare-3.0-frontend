import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// We'll set the Authorization header dynamically within our service functions
// by getting the token from localStorage directly. This is simpler and avoids
// issues with React hooks outside of components.

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('prymshare_token'); // Jotai's atomWithStorage stores it here
    if (token) {
        // The value in localStorage is stringified JSON, so we parse it.
        const parsedToken = JSON.parse(token);
        if (parsedToken) {
           config.headers.Authorization = `Bearer ${parsedToken}`;
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default apiClient;