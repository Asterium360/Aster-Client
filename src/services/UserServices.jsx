// src/services/UserServices.js
import API from "./axiosInstance";

// Obtener todos los usuarios (solo admin)
export const getUsers = async () => {
    const res = await API.get("/user"); // ruta completa al endpoint de usuarios
    console.log("Datos recibidos en getUsers:", res.data);
    return res.data.data || [];
};

// Eliminar usuario por ID
export const deleteUser = async (id) => {
    await API.delete(`/user/${id}`);
};

// Actualizar usuario (por ejemplo, rol)
export const updateUser = async (id, data) => {
    await API.patch(`/user/${id}`, data);
};

// Obtener un usuario específico
export const getUser = async (id) => {
    const res = await API.get(`/user/${id}`);
    return res.data;
};

// Crear usuario (opcional)
export const createUser = async (data) => {
    const res = await API.post("/user", data);
    return res.data;
};
