import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext'; 

/**
 * Componente que protege rutas.
 * Redirige a /login si no está logueado.
 * Redirige a /characters si no tiene el rol permitido (ej. 'admin').
 * * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - El componente a renderizar (la ruta protegida).
 * @param {string[]} [props.allowedRoles=[]] - Roles permitidos para acceder (ej: ['admin']).
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    // Obtenemos el estado de autenticación y el usuario
    const { isLoggedIn, user } = useContext(AuthContext); 

    // 1. Verificar si está logueado
    if (!isLoggedIn) {
        // Redirigir a la página de login
        toast.warn("Necesitas iniciar sesión para acceder a esta página.");
        return <Navigate to="/login" replace />;
    }
    
    // 2. Verificar Roles (si se han especificado roles requeridos)
    if (allowedRoles.length > 0) {
        const userRole = user?.rol;
        
        // Si el usuario no tiene rol O su rol no está en la lista de permitidos
        if (!userRole || !allowedRoles.includes(userRole)) {
            toast.error("No tienes permisos suficientes para acceder a esta función.");
            // Redirigir a una página segura (la lista de personajes)
            return <Navigate to="/characters" replace />; 
        }
    }

    // 3. Si está logueado y cumple con los roles, renderizar el componente hijo
    return children;
};

export default ProtectedRoute;