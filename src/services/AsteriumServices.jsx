import axios from "axios";

const URL_API= "http://localhost:5000/asterium"

//Metodo GET para el READ
//Para ver TODAS las ASTER (Estrellas)
export const getAllAsters = async () => {
    try {
        const response = await axios.get(URL_API);
        return response.data;
    } catch (error) {
        console.error(`getAllAsters error:`, error.message);
        throw error;
    }
}

//Para ver UNA ASTER (Estrella)
export const getAsterById = async (id) => {
    try {
        const response = await axios.get(`${URL_API}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`getAsterById con ID ${id} error:`, error.message);
        throw error;
    }
}

//Metodo POST para el CREATE
export const createAster = async (newAster) => {
    try {
        const response = await axios.post(URL_API, newAster);
        return response.data;
    } catch (error) {
        console.error(`createAster error:`, error.message);
        throw error;
    }
}

//Metodo PUT para el UPDATE
export const updateAster = async (id, updatedAster) => {
    try {
        const response = await axios.put(`${URL_API}/${id}`, updatedAster);
        return response.data;
    } catch (error) {
        console.error(`updateAster con ID ${id} error:`, error.message);
        throw error;
    }
}

//Metodo DELETE para el DELETE
export const deleteAster = async (id) => {
    try {
        const response = await axios.delete(`${URL_API}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`deleteAster con ID ${id} error:`, error.message);
        throw error;
    }
}