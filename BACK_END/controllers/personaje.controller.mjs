// controllers/personaje.controller.mjs

import * as personajeService from '../services/personaje.service.mjs';
import mongoose from 'mongoose';

// GET /api/personajes?nombre=x&tipo=y&page=z
export const getPersonajes = async (req, res) => {
    try {
        // req.query contiene nombre, tipo, page, limit
        const results = await personajeService.getPersonajesList(req.query);
        
        // Devolvemos la respuesta con el formato esperado por tu frontend: { personajes: [], meta: {} }
        res.status(200).json(results);
    } catch (error) {
        console.error('Error en getPersonajes:', error.message);
        res.status(500).json({ message: 'Error interno del servidor al procesar la lista.' });
    }
};

// POST /api/personajes (Protegida por Admin)
export const createPersonaje = async (req, res) => {
    try {
        const nuevoPersonaje = await personajeService.createNewPersonaje(req.body);
        res.status(201).json(nuevoPersonaje);
    } catch (error) {
        // 11000 es el código de error de Mongoose para índice duplicado (nombre)
        if (error.code === 11000) { 
            return res.status(400).json({ message: 'El personaje ya existe (nombre duplicado).' });
        }
        res.status(400).json({ message: 'Error al crear el personaje.', error: error.message });
    }
};

// GET /api/personajes/:id
export const getPersonajeById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             return res.status(400).json({ message: 'ID de personaje inválido.' });
        }
        
        const personaje = await personajeService.getPersonajeDetails(req.params.id);
        
        if (!personaje) {
            return res.status(404).json({ message: 'Personaje no encontrado.' });
        }
        res.status(200).json(personaje);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el detalle del personaje.' }); 
    }
};

// PUT /api/personajes/:id (Protegida por Admin)
export const updatePersonaje = async (req, res) => {
     try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             return res.status(400).json({ message: 'ID de personaje inválido.' });
        }
        
        const updatedChar = await personajeService.updatePersonaje(req.params.id, req.body);
        
        if (!updatedChar) {
            return res.status(404).json({ message: 'Personaje no encontrado.' });
        }
        res.status(200).json(updatedChar);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el personaje.', error: error.message });
    }
};

// DELETE /api/personajes/:id (Protegida por Admin)
export const deletePersonaje = async (req, res) => {
     try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             return res.status(400).json({ message: 'ID de personaje inválido.' });
        }
        
        const deletedChar = await personajeService.deletePersonaje(req.params.id);
        
        if (!deletedChar) {
            return res.status(404).json({ message: 'Personaje no encontrado.' });
        }
        // 204 No Content es estándar para DELETE exitoso
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el personaje.' });
    }
};