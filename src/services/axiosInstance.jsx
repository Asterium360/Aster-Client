import axios from "axios";
import useAuthStore from "../store/authStore";

const API = axios.create({
    baseURL: "http://localhost:4000"
});

// Interceptor para agregar token en cada petición
API.interceptors.request.use((config) => {
    const { token } = useAuthStore.getState(); // obtener token directamente del store
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export default API;
