// src/components/context/ObrasContext.jsx

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getObras, createObra, updateObra, deleteObra } from '../../api/ObrasApi'; // ⬅️ Nuevo API
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

// eslint-disable-next-line react-refresh/only-export-components
export const ObrasContext = createContext(); // ⬅️ Nombre del Contexto

export const ObrasProvider = ({ children }) => { // ⬅️ Nombre del Provider
  const [obrasList, setObrasList] = useState([]); // ⬅️ Estado de la lista
  const [loadingObras, setLoadingObras] = useState(true); // ⬅️ Estado de carga

  // Obtener obras iniciales
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const { data } = await getObras();
        setObrasList(data);
        // 🟢 TOAST: Éxito en la carga inicial
        toast.success("Obras cargadas con éxito."); 
      } catch (error) {
        console.error("Error fetching obras:", error);
        // 🟢 TOAST: Error al cargar
        toast.error("Error al cargar la lista de obras. Revisa la conexión con el backend.");
      } finally {
        setLoadingObras(false);
      }
    };
    fetchObras();
  }, []);

  // Crear una nueva obra
  const handleCreateObra = useCallback(async (newObraData) => { // ⬅️ Función de creación
    try {
        const { data } = await createObra(newObraData);
        setObrasList(prev => [...prev, data]);
        // 🟢 TOAST: Éxito al crear
        toast.success(`Obra "${data.titulo}" creada con éxito.`);
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al crear la obra.";
        console.error("Error creating obra:", error);
        // 🟢 TOAST: Error al crear
        toast.error(errorMessage);
        return false;
    }
  }, []);

  // Actualizar una obra existente
  const handleUpdateObra = useCallback(async (id, updatedData) => { // ⬅️ Función de actualización
    try {
        const { data } = await updateObra(id, updatedData);
        setObrasList(prev => prev.map(obra => 
            (obra._id || obra.id) === id ? data : obra
        ));
        // 🟢 TOAST: Éxito al actualizar
        toast.success(`Obra "${data.titulo}" actualizada con éxito.`);
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Error al actualizar la obra.";
        console.error("Error updating obra:", error);
        // 🟢 TOAST: Error al actualizar
        toast.error(errorMessage);
        return false;
    }
  }, []);

  // Eliminar una obra
  const handleDeleteObra = useCallback(async (id, titulo) => { // ⬅️ Función de eliminación
    Swal.fire({
        title: `¿Estás seguro de eliminar la obra "${titulo}"?`,
        text: "¡Esto podría afectar a personajes asociados!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await deleteObra(id);
                setObrasList(prev => prev.filter(obra => (obra._id || obra.id) !== id));
                // 🟢 TOAST: Éxito al eliminar
                toast.success(`Obra "${titulo}" eliminada correctamente.`);
            } catch (error) {
                console.error("Error deleting obra:", error);
                // 🟢 TOAST: Error al eliminar
                toast.error(`Error al eliminar "${titulo}".`);
            }
        }
    });
  }, []);

  const contextValue = useMemo(() => ({
    obrasList,
    loadingObras,
    handleCreateObra,
    handleUpdateObra,
    handleDeleteObra,
  }), [
    obrasList,
    loadingObras,
    handleCreateObra,
    handleUpdateObra,
    handleDeleteObra
  ]);

  return (
    <ObrasContext.Provider value={contextValue}>
      {children}
    </ObrasContext.Provider>
  );
};