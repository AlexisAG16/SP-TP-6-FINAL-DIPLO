// src/models/Obra.model.mjs

import mongoose from 'mongoose';

const ObraSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    tipo_obra: { 
        type: String, 
        // Hacemos el enum más permisivo para coincidir con lo que usa el frontend
        enum: ['Libro', 'Libro/Saga', 'Película', 'Serie', 'Serie de Televisión', 'Juego', 'Otros', 'Otro'], 
        required: true 
    },
    anio_publicacion: { 
        type: Number, 
        required: true 
    },
    genero: { 
        type: String, 
        required: true 
    },
    imagen: { type: String, default: 'https://placehold.co/400x400/374151/ffffff?text=FANTASY' },
    sinopsis: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Obra = mongoose.model('Obra', ObraSchema);

export default Obra;