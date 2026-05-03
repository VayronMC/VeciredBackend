console.log('Iniciando servidor VeciRed Backend...');

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas de prueba
app.get('/', (req, res) => {
  res.json({ message: 'VeciRed Backend API funcionando correctamente' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API test endpoint working' });
});

// Rutas de auth (simuladas por ahora)
app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Registro endpoint - Simulado' });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint - Simulado' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor VeciRed Backend corriendo en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});
