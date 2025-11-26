// src/routes/obra.routes.mjs

import { Router } from 'express';
import { getAllObras, createObra, updateObra, deleteObra } from '../controllers/obra.controller.mjs';
import { protect, admin } from '../middleware/auth.middleware.mjs';
// Importa middlewares de autenticación/permisos si los tienes
// import { checkAuth } from '../middlewares/auth.middleware.mjs'; 
// import { checkRole } from '../middlewares/role.middleware.mjs'; 

const router = Router();

// Ruta pública para obtener todas las obras (el formulario la necesita)
// GET /api/obras
router.get('/', getAllObras); 

// Rutas protegidas para administrar obras (solo admins)
router.post('/', protect, admin, createObra);
router.put('/:id', protect, admin, updateObra);
router.delete('/:id', protect, admin, deleteObra);

// Si necesitaras crear una obra (solo para admins)
// router.post('/', checkAuth, checkRole(['admin']), createObra); 

export default router;