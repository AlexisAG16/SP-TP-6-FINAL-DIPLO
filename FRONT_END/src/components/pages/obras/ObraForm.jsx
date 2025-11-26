// src/components/ObraForm.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ObrasContext } from '../../context/ObrasContext'; // ⬅️ Contexto de Obras

// Estado inicial del formulario
const initialFormState = { 
  titulo: '',
  tipo: 'Libro', 
  anioPublicacion: '', // Se enviará como número
  imagenUrl: 'https://loremflickr.com/320/240/book,fantasy', 
  genero: '',
  sinopsis: '',
};

// 🟢 FUNCIÓN DE VALIDACIÓN CON TOASTS
const validateForm = (form) => {
  const currentYear = new Date().getFullYear();
  let isValid = true;
  
  if (!form.titulo.trim()) {
    toast.error('El título de la obra es obligatorio.');
    isValid = false;
  }
  if (!form.tipo.trim()) {
    toast.error('El tipo de obra (Libro, Serie, etc.) es obligatorio.');
    isValid = false;
  }
  // Validación de año
  const anio = parseInt(form.anioPublicacion);
  if (isNaN(anio) || anio < 1000 || anio > currentYear) {
    toast.error(`El año de publicación debe ser un valor numérico entre 1000 y ${currentYear}.`);
    isValid = false;
  }

  if (!form.genero.trim()) {
    toast.error('El género es obligatorio.');
    isValid = false;
  }

  if (!form.sinopsis.trim()) {
    toast.error('La sinopsis es obligatoria.');
    isValid = false;
  }

  // Validación de URL simple
  if (form.imagenUrl.trim() && !/^https?:\/\/.*/i.test(form.imagenUrl.trim())) {
    toast.error('La URL de la imagen de portada no es válida.');
    isValid = false;
  }

  return isValid; 
};


const ObraForm = ({ obraToEdit }) => { // ⬅️ Nombre del componente
  const { handleCreateObra, handleUpdateObra } = useContext(ObrasContext); // ⬅️ Uso de funciones
  const navigate = useNavigate(); 
  
  const [form, setForm] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ID para usar en la función de actualización
  const obraId = obraToEdit?._id || obraToEdit?.id; 

  // Efecto para precargar datos en modo Edición
  useEffect(() => {
    if (obraToEdit) {
      setForm({
        ...obraToEdit,
        // Aseguramos que el año sea un string para el input de tipo 'number'
        anioPublicacion: String(obraToEdit.anioPublicacion || ''), 
        genero: obraToEdit.genero || '',
        sinopsis: obraToEdit.sinopsis || '',
      });
    }
  }, [obraToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 🟢 LLAMADA A LA VALIDACIÓN CON TOASTS
    const isValid = validateForm(form); 

    if (!isValid) {
      setIsSubmitting(false);
      return; // La validación ya mostró los toasts de error
    }
    
    // Prepara los datos para el API, asegurando que anioPublicacion es un número
    const dataToSend = {
      ...form,
      anioPublicacion: parseInt(form.anioPublicacion), 
    };
    
    let success = false;

    if (obraToEdit) {
      // Editar
      success = await handleUpdateObra(obraId, dataToSend);
    } else {
      // Crear
      success = await handleCreateObra(dataToSend);
    }

    setIsSubmitting(false);

    if (success) {
      // Redirigir a la lista de obras tras el éxito
      navigate('/obras'); // ⬅️ Asumo la ruta /obras
    }
    // Si falla, el toast de error viene de ObrasContext.jsx
  };

  const inputClass = "shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition duration-150";
  const labelClass = "block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2";

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl transition duration-300">
      <h2 className="text-3xl font-extrabold text-center mb-8 
        text-indigo-600 dark:text-purple-400">
        {obraToEdit ? `Editar Obra: ${obraToEdit.titulo}` : 'Registrar Nueva Obra'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campos del formulario... (omito para brevedad, son los mismos de antes) */}
        
        {/* Campo Título */}
        <div>
          <label htmlFor="titulo" className={labelClass}>Título *</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={form.titulo}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: Crónicas Vampíricas"
          />
        </div>

        {/* Campo Tipo (Select) */}
        <div>
          <label htmlFor="tipo" className={labelClass}>Tipo de Obra *</label>
          <select
            id="tipo"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            className={inputClass + " appearance-none"}
          >
            <option value="Libro">Libro</option>
            <option value="Serie">Serie de TV/Streaming</option>
            <option value="Pelicula">Película</option>
            <option value="Juego">Videojuego</option>
            <option value="Otros">Otros (Cómic, Manga, etc.)</option>
          </select>
        </div>

        {/* Nota: eliminamos el campo Autor/Creador — se usa 'genero' en su lugar */}

        {/* Campo Año de Publicación */}
        <div>
          <label htmlFor="anioPublicacion" className={labelClass}>Año de Publicación *</label>
          <input
            type="number"
            id="anioPublicacion"
            name="anioPublicacion"
            value={form.anioPublicacion}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: 1997"
            min="1000"
            max={new Date().getFullYear()}
          />
        </div>

        {/* Campo Imagen URL */}
        <div>
          <label htmlFor="imagenUrl" className={labelClass}>Imagen URL de Portada</label>
          <input
            type="url"
            id="imagenUrl"
            name="imagenUrl"
            value={form.imagenUrl}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://una-url-valida.com/portada.jpg"
          />
          {/* Preview de la imagen si hay una URL */}
          {form.imagenUrl && (
            <div className="mt-4 border border-gray-300 dark:border-gray-600 rounded p-2 text-center">
                <img 
                    src={form.imagenUrl} 
                    alt="Preview de Portada" 
                    className="max-h-40 w-auto mx-auto object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100/374151/ffffff?text=X"}}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Preview</p>
            </div>
          )}
        </div>

        {/* Campo Género */}
        <div>
          <label htmlFor="genero" className={labelClass}>Género *</label>
          <input
            type="text"
            id="genero"
            name="genero"
            value={form.genero}
            onChange={handleChange}
            className={inputClass}
            placeholder="Ej: Fantasía, Terror, Aventura"
          />
        </div>

        {/* Campo Sinopsis */}
        <div>
          <label htmlFor="sinopsis" className={labelClass}>Sinopsis *</label>
          <textarea
            id="sinopsis"
            name="sinopsis"
            value={form.sinopsis}
            onChange={handleChange}
            className={inputClass + ' h-24 resize-none'}
            placeholder="Breve sinopsis de la obra..."
          />
        </div>
        
        {/* Botones de acción */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded font-bold transition duration-150 ${
            isSubmitting
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-purple-600 dark:hover:bg-purple-700'
          }`}
        >
          {isSubmitting ? 'Guardando...' : (obraToEdit ? 'Actualizar Obra' : 'Registrar Obra')}
        </button>

        <button
          type="button"
          onClick={() => navigate('/obras')}
          className="w-full mt-4 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-bold rounded transition duration-150"
        >
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default ObraForm;