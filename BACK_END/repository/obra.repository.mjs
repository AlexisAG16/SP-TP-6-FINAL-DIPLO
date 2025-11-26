// src/repository/obra.repository.mjs

import Obra from '../models/obra.model.mjs'; 

// CREADO PREVIAMENTE: Obtener TODAS las obras (para el SELECT)
export const findAllObras = async () => {
    return Obra.find({}, '_id titulo anio_publicacion')
               .sort({ titulo: 1 });
};

// 🟢 NUEVA FUNCIÓN: Crear Obra
export const createObra = async (data) => Obra.create(data); 

// 🟢 NUEVA FUNCIÓN: Obtener Obra por ID
export const findObraById = async (id) => Obra.findById(id);

// 🟢 NUEVA FUNCIÓN: Actualizar Obra
export const updateObra = async (id, data) => 
    Obra.findByIdAndUpdate(id, data, { new: true, runValidators: true });

// 🟢 NUEVA FUNCIÓN: Eliminar Obra
export const removeObra = async (id) => Obra.findByIdAndDelete(id);