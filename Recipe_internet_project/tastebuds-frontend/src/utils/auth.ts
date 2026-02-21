// Auth utilities
// src/utils/auth.ts

export const setTokens = (
  token: string, 
  refreshToken: string, 
  email: string, 
  profilePic: string,
  username: string
) => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userUsername', username);
  localStorage.setItem('profilePic', profilePic);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const getUserEmail = (): string | null => {
  return localStorage.getItem('userEmail');
};

export const clearTokens = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('profilePic');
  localStorage.removeItem('userUsername');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// Decode JWT to get user ID
export const getCurrentUserId = (): string | null => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
