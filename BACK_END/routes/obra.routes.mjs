// src/routes/obra.routes.mjs

import { Router } from 'express';
import { getAllObras } from '../controllers/obra.controller.mjs';
// Importa middlewares de autenticación/permisos si los tienes
// import { checkAuth } from '../middlewares/auth.middleware.mjs'; 
// import { checkRole } from '../middlewares/role.middleware.mjs'; 

const router = Router();

// Ruta pública para obtener todas las obras (el formulario la necesita)
// GET /api/obras
router.get('/', getAllObras); 

// Si necesitaras crear una obra (solo para admins)
// router.post('/', checkAuth, checkRole(['admin']), createObra); 

export default router;