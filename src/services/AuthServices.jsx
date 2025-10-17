import axios from "axios";

const URL_API= "http://localhost:4000/auth"

//Login 
export const login = async (credentials) => {
    try {
        const response = await axios.post(`${URL_API}/login`, credentials);
        return response.data;
    } catch (error) {
        console.error(`login error:`, error.message);
        throw error;
    }
}

//Register
export const register = async (newUser) => {
    try {
        const response = await axios.post(`${URL_API}/register`, newUser);
        return response.data;
    } catch (error) {
        console.error(`register error:`, error.message);
        throw error;
    }
};

//Change Role
export const changeUserRole = async (userId, newRole, token) => {
    try {
        const response = await axios.put(`${URL_API}/${userId}`, { role: newRole }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Change User Role error:`, error.message);
        throw error;
    }
}

//Logout 
export const logout = async (token) => {
    try {
        const response = await axios.post(`${URL_API}/logout`, {}, {
            headers: {Authorization: `Bearer ${token}`},
        });
        return response.data;
    } catch (error) {
        console.error(`Logout error:`, error.message);
        throw error;
    }
}
