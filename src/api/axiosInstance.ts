import axios from 'axios';
import axiosRetry from 'axios-retry';

const axiosInstance = axios.create({
  baseURL: '/api', // This will be the base URL for our backend later
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add retry logic
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000; // Exponential backoff (1s, 2s, 3s)
  },
  retryCondition: (error) => {
    // Retry on network errors or 5xx server errors
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status ? error.response.status >= 500 : false);
  },
});

export default axiosInstance;
