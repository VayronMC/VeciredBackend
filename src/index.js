import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import solicitudesRoutes from './routes/solicitudesRoutes.js';
import resenaRoutes from './routes/resenaRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rutas
app.use('/api/auth', authRoutes); // /api/auth/register, /api/auth/login
app.use('/api/publicaciones', publicRoutes); // /api/publicaciones
app.use('/api/solicitudes', solicitudesRoutes); // /api/solicitudes
app.use('/api/resenas', resenaRoutes); // /api/resenas 

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'VeciRed Backend API funcionando correctamente' });
});

// Manejo de errores global
app.use((err, req, res, _next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor VeciRed Backend corriendo en puerto ${PORT}`);
});