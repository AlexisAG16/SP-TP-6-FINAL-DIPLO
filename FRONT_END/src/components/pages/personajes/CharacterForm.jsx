// src/components/CharacterForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CharactersContext } from '../../context/CharactersContext'; 
import { ObrasContext } from '../../context/ObrasContext'; // Usamos ObrasContext para listar obras

// Estado inicial del formulario con las claves que Mongoose espera
const initialFormState = { 
  nombre: '',
  tipo: '',
  obra: '', 
  clasificacion: 'Protagonista', 
  imagen: 'https://loremflickr.com/320/240/fantasy', 
  poderes: '' 
};

const CharacterForm = ({ characterToEdit }) => {
  const { handleCreate, handleUpdate } = useContext(CharactersContext);
  // Obtener la lista de obras del contexto de obras
  const { obrasList, loadingObras } = useContext(ObrasContext);
  const navigate = useNavigate(); 
  
  const [form, setForm] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Efecto para precargar datos en modo Edición
  useEffect(() => {
    if (characterToEdit) {
      setForm({
        ...characterToEdit,
        // 🟢 MODIFICACIÓN CLAVE: Extraer el _id del objeto obra poblado
        obra: characterToEdit.obra ? characterToEdit.obra._id : '',
        // Convertir array de poderes a string
        poderes: Array.isArray(characterToEdit.poderes) ? characterToEdit.poderes.join(', ') : characterToEdit.poderes || '',
      });
    }
  }, [characterToEdit]);

  // Manejador genérico de cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!form.tipo.trim()) newErrors.tipo = 'El tipo es obligatorio.';
    // 🟢 VALIDACIÓN DE LA OBRA
    if (!form.obra.trim()) newErrors.obra = 'Debes seleccionar la Obra relacionada.'; 
    if (!form.clasificacion.trim()) newErrors.clasificacion = 'La clasificación es obligatoria.';
    if (!form.imagen.trim()) newErrors.imagen = 'La URL de la imagen es obligatoria.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Preparar datos para el backend
    const dataToSend = {
      ...form,
      // Convertir el string de poderes de vuelta a un array, eliminando espacios vacíos
      poderes: form.poderes.split(',').map(p => p.trim()).filter(p => p.length > 0),
    };

    try {
      if (characterToEdit) {
        await handleUpdate(characterToEdit._id, dataToSend);
        toast.success(`Personaje ${form.nombre} actualizado con éxito.`);
      } else {
        await handleCreate(dataToSend);
        toast.success(`¡Personaje ${form.nombre} creado con éxito!`);
        setForm(initialFormState);
      }
      navigate('/characters');
    } catch (error) {
        toast.error(`Error al ${characterToEdit ? 'actualizar' : 'crear'} el personaje.`);
        console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mostrar un mensaje de carga si la lista de obras aún se está cargando
  if (loadingObras) return <p className="text-center dark:text-gray-300">Cargando opciones de obras...</p>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 shadow-2xl rounded-xl">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700 dark:text-purple-400">
        {characterToEdit ? 'Editar Personaje' : 'Crear Nuevo Personaje'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Nombre */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100"
          />
          {errors.nombre && <p className="text-red-500 text-xs italic mt-1">{errors.nombre}</p>}
        </div>

        {/* Tipo */}
        <div className="mb-4">
          <label htmlFor="tipo" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Tipo</label>
          <input
            type="text"
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100"
          />
          {errors.tipo && <p className="text-red-500 text-xs italic mt-1">{errors.tipo}</p>}
        </div>

        {/* 🟢 CAMBIO CLAVE: SELECT para la Obra */}
        <div className="mb-4">
          <label htmlFor="obra" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Obra (Película o Serie)
          </label>
          <select
            id="obra"
            name="obra" // ⬅️ CRUCIAL: Debe ser el campo 'obra' del form state
            value={form.obra}
            onChange={handleChange}
            required
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500
                       dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100 appearance-none"
          >
            <option value="" disabled>Selecciona una Obra...</option>
            {obrasList.map((media) => (
              // El valor enviado al backend debe ser el ID de la obra
              <option key={media._id} value={media._id}>
                {media.titulo} ({media.anio_publicacion})
              </option>
            ))}
          </select>
          {errors.obra && <p className="text-red-500 text-xs italic mt-1">{errors.obra}</p>}
        </div>

        {/* URL de Imagen */}
        <div className="mb-4">
          <label htmlFor="imagen" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">URL de Imagen</label>
          <input
            type="url"
            id="imagen"
            name="imagen"
            value={form.imagen}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100"
          />
          {errors.imagen && <p className="text-red-500 text-xs italic mt-1">{errors.imagen}</p>}
        </div>

        {/* Poderes */}
        <div className="mb-4">
          <label htmlFor="poderes" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">
            Poderes (separados por coma)
          </label>
          <textarea
            id="poderes"
            name="poderes"
            value={form.poderes}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100"
            rows="3"
            placeholder="Ej: Inmortalidad, Vuelo, Hipnosis"
          />
        </div>

        {/* Clasificación */}
        <div className="mb-4">
          <label htmlFor="clasificacion" className="block text-gray-700 dark:text-gray-300 font-bold mb-2">Clasificación</label>
          <select
            id="clasificacion"
            name="clasificacion"
            value={form.clasificacion}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500
                       dark:bg-gray-700 dark:border-purple-600 dark:text-gray-100 appearance-none"
          >
            <option value="Protagonista">Protagonista</option>
            <option value="Antagonista">Antagonista</option>
            <option value="Aliado">Aliado</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded font-bold transition duration-150 ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700'
          }`}
        >
          {isSubmitting ? 'Guardando...' : (characterToEdit ? 'Actualizar Personaje' : 'Crear Personaje')}
        </button>

        <button
          type="button"
          onClick={() => navigate('/characters')}
          className="w-full mt-4 py-3 px-4 rounded font-bold transition text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default CharacterForm;