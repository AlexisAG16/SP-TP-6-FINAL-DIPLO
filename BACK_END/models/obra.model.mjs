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
        enum: ['Libro/Saga', 'Película', 'Serie de Televisión', 'Otro'], 
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
    sinopsis: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const Obra = mongoose.model('Obra', ObraSchema);

export default Obra;