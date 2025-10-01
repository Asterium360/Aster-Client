// src/store/authStore.js
import { create } from "zustand";

export const initialAuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

export const useAuthStore = create((set, get) => ({
    ...initialAuthState,

    // acción para loguear
    login: (user, token) => set({ isAuthenticated: true, user, token }),

    // acción para desloguear
    logout: () => set({ ...initialAuthState }),

    // reset explícito (útil para tests)
    reset: () => set({ ...initialAuthState }),
}));
