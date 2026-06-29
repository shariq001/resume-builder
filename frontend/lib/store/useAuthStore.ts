import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  full_name: string;
  username: string;
  profile_picture_url: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  
  login: (token, refreshToken) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('access_token', token);
      sessionStorage.setItem('refresh_token', refreshToken);
    }
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
    }
    set({ user: null, isAuthenticated: false });
  },
  
  fetchUser: async () => {
    if (typeof window === 'undefined') return;
    
    const token = sessionStorage.getItem('access_token');
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const userData = await res.json();
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } else {
        sessionStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      set({ isLoading: false });
    }
  }
}));
