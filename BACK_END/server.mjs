// server.mjs

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.config.mjs'; 

// Importar rutas (con .mjs)
import authRoutes from './routes/auth.routes.mjs'; 
import personajeRoutes from './routes/personaje.routes.mjs'; 
import obraRoutes from './routes/obra.routes.mjs'; 

dotenv.config();
connectDB(); 

const corsOptions = {
    // Aquí especificamos exactamente el origen de tu frontend
    origin: process.env.CLIENT_URL, 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos permitidos
    credentials: true, // Permite cookies y headers de autorización
    optionsSuccessStatus: 204
};

const app = express();

// Middlewares
app.use(cors(corsOptions)); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);         // Maneja POST /api/auth/login, etc.
app.use('/api/personajes', personajeRoutes); // Maneja GET /api/personajes, etc.
app.use('/api/obras', obraRoutes);         // Maneja GET /api/obras

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Personajes Fantásticos funcionando...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
});