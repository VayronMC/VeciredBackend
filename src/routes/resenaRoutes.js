import express from 'express';
import {
  createResena,
  getResenasByUser,
  updateSolicitudEstado
} from '../controllers/resenaController.js';

const router = express.Router();

// Crear una reseña
router.post('/', createResena);

// Obtener reseñas de un usuario (evaluado)
router.get('/user/:id', getResenasByUser);

// Actualizar estado de solicitud
router.put('/solicitud/:id', updateSolicitudEstado);

export default router;
