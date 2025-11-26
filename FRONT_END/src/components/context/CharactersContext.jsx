// src/components/context/CharactersContext.jsx

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getCharacters, createCharacter, updateCharacter, deleteCharacter } from '../../api/CharacterApi';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useTheme } from '../../hooks/useTheme';
import useLocalStorage from '../../hooks/useLocalStorage';

// eslint-disable-next-line react-refresh/only-export-components
export const CharactersContext = createContext();

export const CharactersProvider = ({ children }) => {
  const [allCharacters, setAllCharacters] = useState([]); // Lista maestra sin filtrar
  const [loading, setLoading] = useState(true);
  
  // Lógica del Tema
  const { theme, toggleTheme } = useTheme(); 

  // Estado para el filtro por TIPO (existente)
  const [filterType, setFilterType] = useState('');
  
  // Nuevo estado para el término de búsqueda por NOMBRE
  const [searchTermName, setSearchTermName] = useState(''); 

  // Estado persistente para Favoritos
  const [favorites, setFavorites] = useLocalStorage('app-favorites', []);

  // --- LÓGICA CRUD ---

  // Obtener personajes iniciales
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const { data } = await getCharacters();
        // Asumiendo que `poderes` puede ser un string separado por comas, lo convertimos a array si es necesario
        const charactersWithArrayPowers = data.map(char => ({
          ...char,
          poderes: Array.isArray(char.poderes) 
            ? char.poderes 
            : (char.poderes ? char.poderes.split(',').map(p => p.trim()) : [])
        }));
        setAllCharacters(charactersWithArrayPowers);
        // 🟢 TOAST: Éxito en la carga inicial
        toast.success("Personajes cargados con éxito."); 
      } catch (error) {
        console.error("Error fetching characters:", error);
        // 🟢 TOAST: Error al cargar
        toast.error("Error al cargar la lista de personajes. Intentando de nuevo...");
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []); 

  // Eliminar un personaje
  const handleDelete = useCallback(async (id, nombre) => {
    Swal.fire({
        title: `¿Estás seguro de eliminar a ${nombre}?`,
        text: "¡Esta acción es irreversible!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: theme === 'dark' ? 'dark-swal' : ''
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deleteCharacter(id);
                // Actualización de estado
                setAllCharacters(prev => prev.filter(char => (char._id || char.id) !== id));
                // Lógica de favoritos
                setFavorites(prev => prev.filter(fav => fav.id !== id));
                
                // 🟢 TOAST: Éxito al eliminar
                toast.success(`Personaje ${nombre} eliminado correctamente.`);
            } catch (error) {
                console.error("Error deleting character:", error);
                // 🟢 TOAST: Error al eliminar
                toast.error(`Error al eliminar a ${nombre}.`);
            }
        }
    });
  }, [setFavorites, theme]); 

  // Crear un nuevo personaje
  const handleCreate = useCallback(async (newCharacterData) => {
    try {
        const { data } = await createCharacter(newCharacterData);
        // Lógica de transformación de poderes
        const createdCharacter = {
            ...data,
            poderes: Array.isArray(data.poderes) 
                ? data.poderes 
                : (data.poderes ? data.poderes.split(',').map(p => p.trim()) : [])
        };
        setAllCharacters(prev => [...prev, createdCharacter]);
        
        // 🟢 TOAST: Éxito al crear
        toast.success(`Personaje ${data.nombre} creado con éxito.`);
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al crear el personaje.";
        console.error("Error creating character:", error);
        // 🟢 TOAST: Error al crear
        toast.error(errorMessage);
        return false;
    }
  }, []);

  // Actualizar un personaje existente
  const handleUpdate = useCallback(async (id, updatedData) => {
    try {
        const { data } = await updateCharacter(id, updatedData);
        // Lógica de transformación de poderes
        const updatedCharacter = {
            ...data,
            poderes: Array.isArray(data.poderes) 
                ? data.poderes 
                : (data.poderes ? data.poderes.split(',').map(p => p.trim()) : [])
        };
        setAllCharacters(prev => prev.map(char => 
            (char._id || char.id) === id ? updatedCharacter : char
        ));
        
        // 🟢 TOAST: Éxito al actualizar
        toast.success(`Personaje ${data.nombre} actualizado con éxito.`);
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al actualizar el personaje.";
        console.error("Error updating character:", error);
        // 🟢 TOAST: Error al actualizar
        toast.error(errorMessage);
        return false;
    }
  }, []);


  // --- LÓGICA DE FAVORITOS ---
  
  const isFavorite = useCallback((id) => {
    return favorites.some(char => char.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback((character) => {
    const isFav = isFavorite(character._id || character.id);
    const charId = character._id || character.id;
    
    // Objeto favorito simplificado para guardar en localStorage
    const favCharacter = {
      id: charId,
      nombre: character.nombre,
      imagen: character.imagen,
      tipo: character.tipo
    };

    if (isFav) {
        setFavorites(prev => prev.filter(char => char.id !== charId));
        // 🟢 TOAST: Eliminado de favoritos
        toast.info(`${character.nombre} eliminado de favoritos.`, { icon: "💔" });
    } else {
        setFavorites(prev => [...prev, favCharacter]);
        // 🟢 TOAST: Añadido a favoritos
        toast.success(`${character.nombre} añadido a favoritos.`, { icon: "💖" });
    }
  }, [isFavorite, setFavorites]);

  const removeFavorite = useCallback((id) => {
    const removedChar = favorites.find(char => char.id === id);
    setFavorites(prev => prev.filter(char => char.id !== id));
    
    // 🟢 TOAST: Eliminado de la lista del modal
    if(removedChar) {
        toast.info(`${removedChar.nombre} eliminado de la lista.`, { icon: "💔" });
    } else {
        toast.info("Elemento eliminado de favoritos.");
    }
  }, [setFavorites, favorites]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
    // 🟢 TOAST: Limpiado de favoritos
    toast.info("Todos los favoritos han sido eliminados. Lista vacía.", { icon: "🧹" });
  }, [setFavorites]);
  
  // Lista filtrada por tipo y búsqueda por nombre
  const filteredCharacters = useMemo(() => {
    const lowerCaseFilterType = filterType.toLowerCase().trim(); 
    const lowerCaseSearchName = searchTermName.toLowerCase().trim(); 

    // 1. Aplicar el filtro de Tipo (si existe)
    let currentFilteredList = allCharacters;
    
    if (lowerCaseFilterType) {
        // Filtrado por Tipo (coincidencia EXACTA)
        currentFilteredList = currentFilteredList.filter(char => 
            char.tipo.toLowerCase().trim() === lowerCaseFilterType
        );
    }
    
    // 2. Aplicar el filtro de Búsqueda por Nombre (si existe)
    if (lowerCaseSearchName) {
        // Filtramos por coincidencia PARCIAL en la propiedad 'nombre'
        currentFilteredList = currentFilteredList.filter(char => 
            char.nombre.toLowerCase().includes(lowerCaseSearchName)
        );
    }
    
    return currentFilteredList;
    
  }, [allCharacters, filterType, searchTermName]); 

  // Valor del Contexto
  const contextValue = useMemo(() => ({
    characters: filteredCharacters, // Lista filtrada por tipo y nombre
    allCharacters, 
    loading,
    handleDelete,
    handleCreate,
    handleUpdate,
    filterType,
    setFilterType,
    setSearchTermName, 
    theme, 
    toggleTheme,
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
  }), [
    filteredCharacters, 
    allCharacters, 
    loading, 
    handleDelete, 
    handleCreate, 
    handleUpdate, 
    filterType, 
    setFilterType, 
    setSearchTermName, 
    theme, 
    toggleTheme,
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites
  ]);

  return (
    <CharactersContext.Provider value={contextValue}>
      {children}
    </CharactersContext.Provider>
  );
};