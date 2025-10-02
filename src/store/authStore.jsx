import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        set({ user: userData, token, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null, isAuthenticated: false });
    },

    initialize: () => {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        if (token && user) {
            set({ user, token, isAuthenticated: true });
        }
    }
}));

export default useAuthStore;
