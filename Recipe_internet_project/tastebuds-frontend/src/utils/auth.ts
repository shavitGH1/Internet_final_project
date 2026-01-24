// Auth utilities
export const setTokens = (token: string, refreshToken: string, userEmail?: string): void => {
  localStorage.setItem('token', token);
  localStorage.setItem('refreshToken', refreshToken);
  if (userEmail) {
    localStorage.setItem('userEmail', userEmail);
  }
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
