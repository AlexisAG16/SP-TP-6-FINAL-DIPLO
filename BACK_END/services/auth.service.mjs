// services/auth.service.mjs

import jwt from 'jsonwebtoken';
import * as authRepository from '../repository/auth.repository.mjs';

// Genera el JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

export const register = async ({ nombre, email, password, adminCode }) => {
    email = email?.toLowerCase().trim();
    nombre = nombre?.trim();

    const userExists = await authRepository.findUserByEmail(email);
    if (userExists) {
        throw new Error('El usuario ya existe con ese email.');
    }
    
    let newUser;
    try {
        const payload = { nombre, email, password };
        if (adminCode) {
            if (!process.env.ADMIN_SECRET) {
                throw new Error('Registro como admin no permitido en esta instancia (ADMIN_SECRET no definido).');
            }
            if (adminCode !== process.env.ADMIN_SECRET) {
                throw new Error('Código de administrador inválido.');
            }

            const adminCount = await authRepository.countAdmins();
            if (adminCount > 0) {
                throw new Error('Ya existe un administrador. Solo se permite un único usuario admin.');
            }
            payload.rol = 'admin';
        }

        newUser = await authRepository.createUser(payload);
    } catch (err) {
        if (err && err.code === 11000) {
            throw new Error('El usuario ya existe con ese email.');
        }
        throw err;
    }
    
    // 3. Generar token
    const token = generateToken(newUser._id);

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