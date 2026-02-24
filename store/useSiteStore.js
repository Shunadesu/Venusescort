'use client';

import { create } from 'zustand';

export const useSiteStore = create((set) => ({
  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
}));
