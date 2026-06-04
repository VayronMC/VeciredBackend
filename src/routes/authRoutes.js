import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para obtener perfil del usuario
router.get('/profile', getProfile);

// Ruta para actualizar perfil del usuario
router.put('/profile', updateProfile);

export default router;
