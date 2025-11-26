// controllers/auth.controller.mjs

import * as authService from '../services/auth.service.mjs';

// POST /api/auth/register
export const registerUser = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'Por favor, introduce nombre, email y contraseña.' });
        }

        const data = await authService.register({ nombre, email, password });
        res.status(201).json(data);
    } catch (error) {
        console.error('Error en registerUser:', error);
        // Si el error viene de Mongo por clave duplicada -> 409 Conflict
        if (error.code === 11000 || /ya existe/i.test(error.message)) {
            return res.status(409).json({ message: error.message });
        }
        // Errores de validación
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        // Por defecto 500
        res.status(500).json({ message: 'Error interno al registrar usuario.' });
    }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
             return res.status(400).json({ message: 'Por favor, introduce email y contraseña.' });
        }
        
        const data = await authService.login({ email, password });
        res.status(200).json(data);
    } catch (error) {
        // 401 Unauthorized por credenciales inválidas
        res.status(401).json({ message: error.message });
    }
};