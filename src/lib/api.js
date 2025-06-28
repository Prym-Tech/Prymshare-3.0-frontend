import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    const tokenString = localStorage.getItem('prymshare_access_token');
    if (tokenString) {
      const token = JSON.parse(tokenString);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) { prom.reject(error); } 
        else { prom.resolve(token); }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshTokenString = localStorage.getItem('prymshare_refresh_token');
      const refreshToken = refreshTokenString ? JSON.parse(refreshTokenString) : null;

      if (refreshToken) {
        try {
          const { data } = await apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
          localStorage.setItem('prymshare_access_token', JSON.stringify(data.access));
          apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.access;
          processQueue(null, data.access);
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('prymshare_access_token');
          localStorage.removeItem('prymshare_refresh_token');
          localStorage.removeItem('prymshare_user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;