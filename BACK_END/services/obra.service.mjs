// src/services/obra.service.mjs

import * as ObraRepository from '../repository/obra.repository.mjs';

export const findAllObras = async () => {
    return ObraRepository.findAllObras();
};

export const createObra = async (data) => {
    return ObraRepository.createObra(data);
};

export const findObraById = async (id) => {
    return ObraRepository.findObraById(id);
};

export const updateObra = async (id, data) => {
    return ObraRepository.updateObra(id, data);
};

export const removeObra = async (id) => {
    // ⚠️ Lógica de negocio crítica antes de eliminar:
    // Aquí deberías añadir una verificación para ver si hay personajes 
    // que aún hacen referencia a esta obra. Si los hay, deberías:
    // 1. Desvincularlos (establecer el campo obra a null).
    // 2. O impedir la eliminación.
    
    return ObraRepository.removeObra(id);
};