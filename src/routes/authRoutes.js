import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

export default router;
