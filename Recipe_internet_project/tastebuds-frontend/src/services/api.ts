import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

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
  commentCount?: number;
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
  userProfilePic: string; 
  username: string;
  email?: string;
  user?: any;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('profilePic');
      localStorage.removeItem('userUsername');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, password: string, profilePic?: string, username?: string) =>
    apiClient.post<AuthResponse>('/auth/register', { email, password, profilePic, username }),
  
  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }),
  
  refreshToken: (refreshToken: string) =>
    apiClient.post<AuthResponse>('/auth/refresh-token', { refreshToken }),

  googleLogin: (credential: string) =>
    apiClient.post<AuthResponse>('/auth/google', { credential }),
};

export const userAPI = {
  updateProfile: (profilePic: string, username: string) => 
    apiClient.put('/user/update-profile', { profilePic, username }),
};

export const recipesAPI = {
  getAllRecipes: () => apiClient.get<Recipe[]>('/recipes'),
  getRecipeById: (id: string) => apiClient.get<Recipe>(`/recipes/${id}`),
  createRecipe: (recipeData: Partial<Recipe>) => apiClient.post<Recipe>('/recipes', recipeData),
  updateRecipe: (id: string, recipeData: Partial<Recipe>) => 
    apiClient.patch<Recipe>(`/recipes/${id}`, recipeData),
  deleteRecipe: (id: string) => apiClient.delete(`/recipes/${id}`),
  toggleFavorite: (id: string) => apiClient.post(`/recipes/${id}/favorite`),
  addRecipeFromUrl: (data: { url: string }) => apiClient.post<Recipe>('/recipes/url', data),
};

export const commentsAPI = {
  getByRecipe: (recipeId: string) => 
    apiClient.get(`/comments/recipe/${recipeId}`),
    
  addComment: (commentData: { recipe: string; comment: string }) => 
    apiClient.post('/comments', commentData),
    
  deleteComment: (commentId: string) => 
    apiClient.delete(`/comments/${commentId}`)
};

export const fileAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    // אקסיוס יודע אוטומטית להגדיר את זה כ-multipart/form-data בגלל ה-FormData
    const response = await apiClient.post<{url: string}>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};


export default apiClient;