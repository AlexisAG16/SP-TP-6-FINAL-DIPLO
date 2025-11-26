import Personaje from '../models/personaje.model.mjs'; 
import Obra from '../models/obra.model.mjs';

export const findPersonajes = async ({ nombre, tipo, page, limit }) => {
    const findCriteria = {};
    
    if (nombre) {
        findCriteria.nombre = { $regex: nombre, $options: 'i' }; 
    }
    if (tipo) {
        findCriteria.tipo = { $regex: tipo, $options: 'i' }; 
    }

    const skip = (page - 1) * limit;
    
const [personajes, totalItems] = await Promise.all([
    Personaje.find(findCriteria)
        // 🟢 CORRECCIÓN: Usar 'titulo' en lugar de 'nombre' en la proyección
        // Incluimos '_id' y 'titulo' (el '_id' de la obra se incluye por defecto, pero es mejor ser explícito si se usa proyección)
        .populate('obra', '_id titulo') 
        .limit(limit)
        .skip(skip)
        .sort({ nombre: 1 }), 
    Personaje.countDocuments(findCriteria)
]);

    // Compatibilidad: si existen personajes importados que usan 'obraID' en vez de 'obra', intentamos
    // resolver manualmente la obra y adjuntarla al objeto antes de devolverlo.
    for (const p of personajes) {
        if ((!p.obra || p.obra === null) && p.obraID) {
            try {
                const obraDoc = await Obra.findById(p.obraID).lean();
                if (obraDoc) p.obra = obraDoc;
            } catch (err) {
                // ignore — no queremos detener la consulta por un _id inválido
            }
        }
    }

    const totalPages = Math.ceil(totalItems / limit);
    
    return {
        personajes,
        meta: {
            totalItems,
            totalPages,
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit),
        }
    };
};

export const findById = async (id) => {
    const p = await Personaje.findById(id).populate('obra');
    if ((!p?.obra || p.obra === null) && p?.obraID) {
        try {
            const obraDoc = await Obra.findById(p.obraID).lean();
            if (obraDoc) p.obra = obraDoc;
        } catch (err) {
            // ignore
        }
    }
    return p;
};

export const create = async (data) => Personaje.create(data);
export const update = async (id, data) => Personaje.findByIdAndUpdate(id, data, { new: true, runValidators: true });
export const remove = async (id) => Personaje.findByIdAndDelete(id);