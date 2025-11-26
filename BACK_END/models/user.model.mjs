// models/User.model.mjs

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    rol: { type: String, enum: ['user', 'admin'], default: 'user' }
}, {
    timestamps: true,
    // Fijamos explícitamente el nombre de la colección en español para
    // coincidir con la base de datos existente: 'usuarios'
    collection: 'usuarios'
});

// Middleware para hashear la contraseña
userSchema.pre('save', async function () {
    // En Mongoose >=6 usamos middleware async/await y no llamamos a next()
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar la contraseña
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;