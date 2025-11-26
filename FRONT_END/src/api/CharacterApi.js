import axios from 'axios';

// Apunta a la ruta de Express para el CRUD de personajes
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/personajes`; 

// 1. Obtener todos los personajes
export const getCharacters = async () => {
    return axios.get(BASE_URL);
};

// 2. Obtener un personaje por ID
export const getCharacterById = async (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

// 3. Crear un nuevo personaje
export const createCharacter = async (newCharacter) => {
    return axios.post(BASE_URL, newCharacter);
};

// 4. Actualizar un personaje existente
export const updateCharacter = async (id, updatedData) => {
    return axios.put(`${BASE_URL}/${id}`, updatedData);
};

// 5. Eliminar un personaje
export const deleteCharacter = async (id) => {
    return axios.delete(`${BASE_URL}/${id}`);
};