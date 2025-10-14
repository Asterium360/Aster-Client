import API from "./axiosInstance";

//Metodo GET para el READ
//Para ver TODAS las ASTER (Estrellas)
export const getAllAsters = async () => {
    try {
        const response = await API.get(`/asterium`);
        return response.data;
    } catch (error) {
        console.error(`getAllAsters error:`, error.message);
        throw error;
    }
}

// Metodo GET para ver SOLO PUBLICADAS (con límite: por defecto 3)
export const getPublishedAsters = async (limit = 3) => {
  try {
    // requiere que tu backend tenga la ruta GET /asterium/published y soporte ?limit=
    const response = await API.get(`/asterium`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error(`getPublishedAsters error:`, msg(error));
    throw error;
  }
};

//Para ver UNA ASTER (Estrella)
export const getAsterById = async (id) => {
    try {
        const response = await API.get(`/asterium/${id}`);
        return response.data;
    } catch (error) {
        console.error(`getAsterById con ID ${id} error:`, error.message);
        throw error;
    }
}

//Metodo POST para el CREATE
export const createAster = async (newAster) => {
    try {
        const response = await API.post(`/asterium`, newAster);
        return response.data;
    } catch (error) {
        console.error(`createAster error:`, error.message);
        throw error;
    }
}

//Metodo PUT para el UPDATE
export const updateAster = async (id, updatedAster) => {
    try {
        const response = await API.put(`/asterium/${id}`, updatedAster);
        return response.data;
    } catch (error) {
        console.error(`updateAster con ID ${id} error:`, error.message);
        throw error;
    }
}

//Metodo DELETE para el DELETE
export const deleteAster = async (id) => {
    try {
        const response = await API.delete(`/asterium/${id}`);
        return response.data;
    } catch (error) {
        console.error(`deleteAster con ID ${id} error:`, error.message);
        throw error;
    }
}