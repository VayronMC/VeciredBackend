import express from 'express';
import { createRequest, getUserRequests } from '../controllers/solicitudesController.js';

const router = express.Router();

// Crear una nueva solicitud
router.post('/', createRequest);

// Obtener solicitudes del usuario
router.get('/user/:usuario_id', getUserRequests);

export default router;
