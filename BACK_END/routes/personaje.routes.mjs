// routes/personaje.routes.mjs

import express from 'express';
import { 
    getPersonajes, 
    getPersonajeById, 
    createPersonaje, 
    updatePersonaje, 
    deletePersonaje 
} from '../controllers/personaje.controller.mjs';
import { protect, admin } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Rutas Públicas (Lista y Detalle) - Manejan Filtros y Paginación
router.get('/', getPersonajes);
router.get('/:id', getPersonajeById);

// Rutas Protegidas (Requieren JWT y rol 'admin')
router.post('/', protect, admin, createPersonaje);
router.put('/:id', protect, admin, updatePersonaje);
router.delete('/:id', protect, admin, deletePersonaje);

export default router;