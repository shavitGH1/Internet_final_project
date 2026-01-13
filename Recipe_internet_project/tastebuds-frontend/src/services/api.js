import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email, password) =>
    apiClient.post('/auth/register', { email, password }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  refreshToken: (refreshToken) =>
    apiClient.post('/auth/refresh-token', { refreshToken }),
};

// Recipes API
export const recipesAPI = {
  getAllRecipes: () => apiClient.get('/recipes'),
  getRecipeById: (id) => apiClient.get(`/recipes/${id}`),
  createRecipe: (recipeData) => apiClient.post('/recipes', recipeData),
  updateRecipe: (id, recipeData) => apiClient.patch(`/recipes/${id}`, recipeData),
  deleteRecipe: (id) => apiClient.delete(`/recipes/${id}`),
};

// Comments API
export const commentsAPI = {
  getComments: (recipeId) => apiClient.get(`/recipes/${recipeId}/comments`),
  addComment: (recipeId, commentData) =>
    apiClient.post(`/recipes/${recipeId}/comments`, commentData),
};

export default apiClient;
