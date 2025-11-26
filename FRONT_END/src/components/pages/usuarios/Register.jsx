import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [userData, setUserData] = useState({ nombre: '', email: '', password: '', adminCode: '' });
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    if (isLoggedIn) {
        return <Navigate to="/characters" replace />;
    }

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validación de campos
        if (!userData.nombre.trim() || !userData.email.trim() || !userData.password.trim()) {
            toast.error("Por favor, rellena todos los campos.");
            setIsSubmitting(false);
            return;
        }

        if (userData.password.length < 6) {
             toast.error("La contraseña debe tener al menos 6 caracteres.");
            setIsSubmitting(false);
            return;
        }

        // Si el usuario eligió crear un admin, incluimos adminCode
        const payload = { ...userData };
        if (!isAdminMode) delete payload.adminCode; // remove adminCode if not intended

        const success = await register(payload);
        
        setIsSubmitting(false);

        if (success) {
            navigate('/characters', { replace: true });
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl transition duration-300">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-600 dark:text-indigo-400">
                    Crear Cuenta ✍️
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div>
                        <label 
                            htmlFor="nombre" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Nombre Completo
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={userData.nombre}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Contraseña (mín. 6 caracteres)
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="Define una contraseña segura"
                        />
                    </div>

                    {/* Opcional: Crear como admin usando un código secreto */}
                    <div className="flex items-center space-x-3">
                        <input
                            id="isAdminMode"
                            type="checkbox"
                            checked={isAdminMode}
                            onChange={() => setIsAdminMode(prev => !prev)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="isAdminMode" className="text-sm text-gray-700 dark:text-gray-300">Crear como administrador</label>
                    </div>

                    {isAdminMode && (
                        <div>
                            <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código de Admin (secreto)</label>
                            <input
                                type="password"
                                id="adminCode"
                                name="adminCode"
                                value={userData.adminCode}
                                onChange={(e) => setUserData({ ...userData, adminCode: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                                placeholder="Código secreto para crear un admin"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition duration-150 ${
                            isSubmitting
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700'
                        }`}
                    >
                        {isSubmitting ? 'Registrando...' : 'Registrar y Entrar'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿Ya tienes cuenta?{' '}
                    <button 
                        onClick={() => navigate('/login')}
                        className="font-medium text-purple-600 hover:text-purple-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                        Inicia Sesión
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;