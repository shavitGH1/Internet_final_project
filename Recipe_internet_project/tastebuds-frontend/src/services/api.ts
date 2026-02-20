import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

// Types
export interface Recipe {
  _id?: string;
  title: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  imageCover: string;
  difficulty?: 'easy' | 'medium' | 'difficult';
  description?: string;
  user?: string | { _id: string; email: string };
  favorites?: string[] | { _id: string }[];
  createdAt?: Date;
}

export interface Comment {
  _id?: string;
  comment: string;
  user?: string | { _id?: string; email?: string };
  recipe?: string;
  createdAt?: Date;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user?: any;
}

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
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

// Handle 401 responses (unauthorized - expired token, invalid token, etc.)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
      
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }),
  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh-token', { refreshToken }),
};

// Recipes API
export const recipesAPI = {
  getAllRecipes: () => apiClient.get<Recipe[]>('/recipes'),
  getRecipeById: (id: string) => apiClient.get<Recipe>(`/recipes/${id}`),
  createRecipe: (recipeData: Partial<Recipe>) => apiClient.post<Recipe>('/recipes', recipeData),
  updateRecipe: (id: string, recipeData: Partial<Recipe>) => 
    apiClient.patch<Recipe>(`/recipes/${id}`, recipeData),
  deleteRecipe: (id: string) => apiClient.delete(`/recipes/${id}`),
  toggleFavorite: (id: string) => apiClient.post(`/recipes/${id}/favorite`),
};

// Comments API
export const commentsAPI = {
  getComments: (recipeId: string) => apiClient.get<Comment[]>(`/recipes/${recipeId}/comments`),
  addComment: (recipeId: string, commentData: Partial<Comment>) =>
    apiClient.post<Comment>(`/recipes/${recipeId}/comments`, commentData),
};

export default apiClient;
