// src/controllers/obra.controller.mjs (MODIFICADO)

import * as ObraService from '../services/obra.service.mjs';

// GET /api/obras (Lista para SELECT - Público)
export const getAllObras = async (req, res) => {
    try {
        // 🟢 Usamos el Servicio
        const obras = await ObraService.findAllObras();
        res.status(200).json(obras); 
    } catch (error) {
        console.error('Error en getAllObras:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la lista de obras.' });
    }
};

// GET /api/obras/:id (Detalle de una Obra - Protegido/Admin)
export const getObraById = async (req, res) => {
    try {
        // 🟢 Usamos el Servicio
        const obra = await ObraService.findObraById(req.params.id);
        if (!obra) {
            return res.status(404).json({ message: 'Obra no encontrada.' });
        }
        res.status(200).json(obra);
    } catch (error) {
        console.error('Error en getObraById:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};


// POST /api/obras (Crear Obra - Protegido/Admin)
export const createObra = async (req, res) => {
    try {
        // Validación básica (el modelo Mongoose ya valida 'required')
        if (!req.body.titulo || !req.body.tipo_obra) {
            return res.status(400).json({ message: 'Faltan campos obligatorios (título, tipo_obra).' });
        }

        // 🟢 Usamos el Servicio
        const newObra = await ObraService.createObra(req.body);
        res.status(201).json(newObra);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'El título de la obra ya existe.' });
        }
        console.error('Error en createObra:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la obra.' });
    }
};

// PUT /api/obras/:id (Actualizar Obra - Protegido/Admin)
export const updateObra = async (req, res) => {
    try {
        // 🟢 Usamos el Servicio
        const updatedObra = await ObraService.updateObra(req.params.id, req.body);
        if (!updatedObra) {
            return res.status(404).json({ message: 'Obra no encontrada para actualizar.' });
        }
        res.status(200).json(updatedObra);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'El título de la obra ya existe.' });
        }
        console.error('Error en updateObra:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la obra.' });
    }
};

// DELETE /api/obras/:id (Eliminar Obra - Protegido/Admin)
export const deleteObra = async (req, res) => {
    try {
        // 🟢 Usamos el Servicio
        const removedObra = await ObraService.removeObra(req.params.id);
        if (!removedObra) {
            return res.status(404).json({ message: 'Obra no encontrada para eliminar.' });
        }
        res.status(200).json({ message: 'Obra eliminada con éxito.' });
    } catch (error) {
        console.error('Error en deleteObra:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la obra.' });
    }
};