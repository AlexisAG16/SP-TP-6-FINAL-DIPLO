import React, { useContext } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom'; // ⬅️ Importamos useNavigate
import { CharactersContext } from '../../context/CharactersContext';
import CharacterForm from './CharacterForm';
import LoadingSpinner from '../../ui/LoadingSpinner';

const CharacterEdit = () => {
    const { id } = useParams();
    const { characters,
loading } = useContext(CharactersContext);
    const navigate = useNavigate(); // ⬅️ Inicializamos

    if (loading) return <LoadingSpinner message="Cargando personaje..." />;

    const characterToEdit = characters.find(c => c.id === id);

    if (!characterToEdit) {
        return <Navigate to="/characters" replace />;
    }

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

            <CharacterForm characterToEdit={characterToEdit} />
        </div>
    );
};

export default CharacterEdit;