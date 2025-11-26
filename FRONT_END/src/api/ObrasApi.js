// src/api/ObrasApi.js

import axios from 'axios';

// Apunta a la ruta de Express para el CRUD de obras (ajusta si es necesario)
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/obras`; 

// 1. Obtener todas las obras
export const getObras = async () => {
    return axios.get(BASE_URL);
};

// 2. Obtener una obra por ID
export const getObraById = async (id) => {
    return axios.get(`${BASE_URL}/${id}`);
};

// 3. Crear una nueva obra
export const createObra = async (newObra) => {
    // Nota: El backend podría requerir autenticación para esta acción
    return axios.post(BASE_URL, newObra);
};

// 4. Actualizar una obra existente
export const updateObra = async (id, updatedData) => {
    // Nota: El backend podría requerir autenticación para esta acción
    return axios.put(`${BASE_URL}/${id}`, updatedData);
};

// 5. Eliminar una obra
export const deleteObra = async (id) => {
    // Nota: El backend podría requerir autenticación para esta acción
    return axios.delete(`${BASE_URL}/${id}`);
};