// utilities/externalApi.util.mjs

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL;

/**
 * Simula la consulta a una API externa para enriquecer la descripción.
 */
export const getEnrichedDescription = async (nombre, tipo) => {
    if (!EXTERNAL_API_URL) {
        console.warn("API externa no configurada en .env. Usando descripción de respaldo.");
        return `Descripción generada: ${nombre} es un(a) ${tipo} de gran misterio.`;
    }

    try {
        // En un caso real, la URL sería diferente.
        // Aquí simulamos una llamada que siempre devuelve un resultado simple.
        const response = await axios.get(EXTERNAL_API_URL + '1'); // Llama a un post ID 1
        
        // Simulación: usamos el título del post como descripción enriquecida
        const enrichedText = response.data?.title 
            ? `(API Externa) Título: ${response.data.title}. Personaje: ${nombre}, Tipo: ${tipo}.`
            : `Descripción de respaldo 2: ${nombre} tiene un propósito desconocido.`;
            
        return enrichedText;
        
    } catch (error) {
        console.error('Error al consultar API externa:', error.message);
        return `Descripción de emergencia: ${nombre} es un ${tipo} de gran poder.`;
    }
};