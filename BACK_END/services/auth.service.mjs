// services/auth.service.mjs

import jwt from 'jsonwebtoken';
import * as authRepository from '../repository/auth.repository.mjs';

// Genera el JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const register = async ({ nombre, email, password }) => {
    // Normalizar campos
    email = email?.toLowerCase().trim();
    nombre = nombre?.trim();

    // 1. Verificar si el usuario ya existe (lógica de negocio)
    const userExists = await authRepository.findUserByEmail(email);
    if (userExists) {
        throw new Error('El usuario ya existe con ese email.');
    }
    
    // 2. Crear usuario (llama al repositorio, que usa el modelo con bcrypt)
    let newUser;
    try {
        newUser = await authRepository.createUser({ nombre, email, password });
    } catch (err) {
        // Si Mongo lanza un error por duplicado, mapearlo
        if (err && err.code === 11000) {
            throw new Error('El usuario ya existe con ese email.');
        }
        throw err;
    }
    
    // 3. Generar token
    const token = generateToken(newUser._id);

    // 4. Devolver la data (sin la contraseña hasheada)
    const userResponse = { 
        id: newUser._id, 
        nombre: newUser.nombre, 
        email: newUser.email, 
        rol: newUser.rol 
    };
    return { user: userResponse, token };
};

export const login = async ({ email, password }) => {
    // 1. Buscar usuario
    const user = await authRepository.findUserByEmail(email);

    // 2. Validar credenciales
    if (user && (await user.matchPassword(password))) {
        // 3. Generar token
        const token = generateToken(user._id);

        // 4. Devolver data
        const userResponse = { 
            id: user._id, 
            nombre: user.nombre, 
            email: user.email, 
            rol: user.rol 
        };
        return { user: userResponse, token };
    } else {
        throw new Error('Credenciales inválidas (email o contraseña incorrectos).');
    }
};