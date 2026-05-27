import express from 'express';
import {
  getAllPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  getNotifications
} from '../controllers/publicController.js';

const router = express.Router();

// Obtener todas las publicaciones (con filtros opcionales)
router.get('/', getAllPublications);

// Obtener una publicación por ID
router.get('/:id', getPublicationById);

// Crear una nueva publicación
router.post('/', createPublication);

// Actualizar una publicación
router.put('/:id', updatePublication);

// Eliminar una publicación
router.delete('/:id', deletePublication);

// Obtener notificaciones del usuario
router.get('/notificaciones/list', getNotifications);

export default router;