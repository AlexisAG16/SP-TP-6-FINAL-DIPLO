import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();

    if (isLoggedIn) {
        // Si ya está logueado, redirigimos con <Navigate /> (evita side-effects en render)
        return <Navigate to="/characters" replace />;
    }

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!credentials.email.trim() || !credentials.password.trim()) {
            toast.error("Por favor, rellena ambos campos.");
            setIsSubmitting(false);
            return;
        }

        const success = await login(credentials);
        
        setIsSubmitting(false);

        if (success) {
            navigate('/characters', { replace: true });
        }
    };

    return (
        <div className="flex justify-center items-center py-10">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl transition duration-300">
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600 dark:text-purple-400">
                    Iniciar Sesión 👤
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    
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
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="ejemplo@correo.com"
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Contraseña
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                            placeholder="Introduce tu contraseña"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-bold transition duration-150 ${
                            isSubmitting
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700'
                        }`}
                    >
                        {isSubmitting ? 'Accediendo...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿No tienes cuenta?{' '}
                    <button 
                        onClick={() => navigate('/register')}
                        className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                        Regístrate aquí
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;