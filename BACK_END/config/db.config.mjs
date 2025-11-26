// config/db.config.mjs

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        // If you keep the DB name in a separate env var, prefer passing it to mongoose
        // so the connection target is explicit and easier to change during deployments.
        const options = {};
        if (process.env.MONGO_DB_NAME) options.dbName = process.env.MONGO_DB_NAME;
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        console.log(`✅ MongoDB conectado: ${conn.connection.host} (BD: ${conn.connection.name})`);
    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
        process.exit(1); 
    }
};

export default connectDB;