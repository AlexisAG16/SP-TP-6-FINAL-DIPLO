import axios from 'axios';

// Usamos la variable de entorno para la URL base
const AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`; 

// 1. Registro de Usuario (POST /api/auth/register)
export const registerUser = async (userData) => {
    return axios.post(`${AUTH_URL}/register`, userData);
};

// 2. Login de Usuario (POST /api/auth/login)
export const loginUser = async (credentials) => {
    return axios.post(`${AUTH_URL}/login`, credentials);
};