// models/Personaje.model.mjs

import mongoose from 'mongoose';

const personajeSchema = new mongoose.Schema({
    nombre: 
    { 
        type: String, required: true, trim: true, unique: true 
    },
    tipo: 
    { 
        type: String, required: true, trim: true 
    }, // Filtro principal
    // Usamos el campo "obra" (ObjectId) para mantener compatibilidad con populate('obra')
    obra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Obra',
        // No obligatorio: algunos documentos existentes en la colección pueden no tener obra.
        required: false
    },
    clasificacion: { type: String, enum: ['Protagonista', 'Antagonista', 'Aliado', 'Secundario'], default: 'Secundario' },
    imagen: { type: String, default: 'https://placehold.co/400x400/374151/ffffff?text=FANTASY' },
    poderes: { type: [String], default: [] },
    descripcion: { type: String, default: '' }
}, {
    timestamps: true
});

const Personaje = mongoose.model('Personaje', personajeSchema);

export default Personaje;