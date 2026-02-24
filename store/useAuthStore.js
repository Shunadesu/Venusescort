'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const TOKEN_KEY = 'userToken';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        if (token) typeof window !== 'undefined' && localStorage.setItem(TOKEN_KEY, token);
        set({ token, user });
      },
      logout: () => {
        typeof window !== 'undefined' && localStorage.removeItem(TOKEN_KEY);
        set({ token: null, user: null });
      },
    }),
    { name: 'user-auth', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
);
