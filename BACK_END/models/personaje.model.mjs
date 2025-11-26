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
    obra: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Obra', // <-- ¡Debe coincidir con el nombre de tu modelo!
        required: true
    },
    clasificacion: { type: String, enum: ['Protagonista', 'Antagonista', 'Aliado', 'Secundario'], default: 'Secundario' },
    imagen: { type: String, default: 'https://placehold.co/400x400/374151/ffffff?text=FANTASY' },
    poderes: { type: [String], default: [] },
    descripcion: { type: String, default: 'Un personaje místico del mundo de la fantasía.' } 
}, {
    timestamps: true
});

const Personaje = mongoose.model('Personaje', personajeSchema);

export default Personaje;