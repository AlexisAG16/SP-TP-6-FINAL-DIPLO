// middleware/auth.middleware.mjs

import jwt from 'jsonwebtoken';
import User from '../models/user.model.mjs'; 

// Middleware para verificar el Token JWT
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                 return res.status(401).json({ message: 'Token inválido o usuario no encontrado.' });
            }
            
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'No autorizado, token fallido o expirado.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no se proveyó token.' });
    }
};

// Middleware para verificar el Rol de Administrador
const admin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        // 403 Forbidden
        res.status(403).json({ 
            message: 'Acceso denegado. Se requiere rol de administrador.' 
        });
    }
};

export { protect, admin };