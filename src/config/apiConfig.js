import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_KEY = import.meta.env.VITE_API_KEY;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` })
  }
});

// API endpoints configuration
export const endpoints = {
  // Products
  products: {
    getAll: '/api/products',
    getById: (id) => `/api/products/${id}`,
    getByCategory: (category) => `/api/products/category/${category}`
  },
  
  // Sellers
  sellers: {
    getAll: '/api/sellers',
    getById: (id) => `/api/sellers/${id}`,
    getTop: '/api/sellers/top'
  },
  
  // Customers
  customers: {
    getAll: '/api/customers',
    getById: (id) => `/api/customers/${id}`,
    getTop: '/api/customers/top'
  },
  
  // Utility
  health: '/health',
  info: '/'
};

// API service functions
export const apiService = {
  // Products
  getProducts: (params = {}) => apiClient.get(endpoints.products.getAll, { params }),
  getProductById: (id) => apiClient.get(endpoints.products.getById(id)),
  getProductsByCategory: (category) => apiClient.get(endpoints.products.getByCategory(category)),
  
  // Sellers
  getSellers: (params = {}) => apiClient.get(endpoints.sellers.getAll, { params }),
  getSellerById: (id) => apiClient.get(endpoints.sellers.getById(id)),
  getTopSellers: (params = {}) => apiClient.get(endpoints.sellers.getTop, { params }),
  
  // Customers
  getCustomers: (params = {}) => apiClient.get(endpoints.customers.getAll, { params }),
  getCustomerById: (id) => apiClient.get(endpoints.customers.getById(id)),
  getTopCustomers: (params = {}) => apiClient.get(endpoints.customers.getTop, { params }),
  
  // Utility
  healthCheck: () => apiClient.get(endpoints.health),
  getApiInfo: () => apiClient.get(endpoints.info)
};

export default apiClient;
