import React from 'react'; // ⬅️ Importamos React
import { useNavigate } from 'react-router-dom'; // ⬅️ Importamos useNavigate
import CharacterForm from './CharacterForm';

const CharacterCreate = () => {
    const navigate = useNavigate(); // ⬅️ Inicializamos

    return (
        <div
className="py-8">
            {/* 🟢 BOTÓN DE VOLVER AÑADIDO */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-sm font-semibold text-indigo-600 dark:text-purple-400 hover:text-indigo-800 dark:hover:text-purple-500 transition duration-150 flex items-center max-w-xl mx-auto"
            >
                &#x2190; Cancelar y Volver
            </button>
            {/* FIN DEL BOTÓN DE VOLVER */}
            
            <CharacterForm />
        </div>
    );
};

export default CharacterCreate;