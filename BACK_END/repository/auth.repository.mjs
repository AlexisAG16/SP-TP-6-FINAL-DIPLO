// repository/auth.repository.mjs

import User from '../models/user.model.mjs'; 

export const findUserByEmail = async (email) => {
    return User.findOne({ email });
};

export const createUser = async (userData) => {
    // La encriptación ocurre en el middleware 'pre-save' del modelo.
    return User.create(userData);
};