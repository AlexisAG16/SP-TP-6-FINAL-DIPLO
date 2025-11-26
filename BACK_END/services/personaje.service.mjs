// services/personaje.service.mjs

import * as repository from '../repository/personaje.repository.mjs';
import { getEnrichedDescription } from '../utilities/externalApi.util.mjs';

/**
 * Orquestra el listado con paginación y filtros.
 */
export const getPersonajesList = async (queryParams) => {
    // Saneamiento y valores por defecto para paginación
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 8; // Tu frontend usa 8 por defecto
    
    const results = await repository.findPersonajes({
        nombre: queryParams.nombre,
        tipo: queryParams.tipo,
        page,
        limit
    });
    
    return results;
};

/**
 * Crea un personaje, llamando a la API externa para enriquecer la descripción.
 */
export const createNewPersonaje = async (personajeData) => {
    // 1. Usar la utilidad para enriquecer los datos
    const descripcionEnriquecida = await getEnrichedDescription(
        personajeData.nombre, 
        personajeData.tipo
    );
    
    // Aceptar dato legacy 'obraID' y mapear a 'obra' para mantener compatibilidad
    const dataToCreate = {
        ...personajeData,
        descripcion: descripcionEnriquecida,
        obra: personajeData.obra || personajeData.obraID || null
    };

    // 2. Crear el personaje en la DB
    const newPersonaje = await repository.create(dataToCreate);
    return newPersonaje;
};

// Funciones CRUD simples
export const getPersonajeDetails = async (id) => repository.findById(id);
export const updatePersonaje = async (id, data) => {
    // Soportar campo legacy obraID al actualizar
    const updatePayload = { ...data };
    if (updatePayload.obraID && !updatePayload.obra) {
        updatePayload.obra = updatePayload.obraID;
        delete updatePayload.obraID;
    }
    return repository.update(id, updatePayload);
};
export const deletePersonaje = async (id) => repository.remove(id);