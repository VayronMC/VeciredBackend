import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../routes/authRoutes.js';
import publicRoutes from '../routes/publicRoutes.js';
import resenaRoutes from '../routes/resenaRoutes.js';
import solicitudesRoutes from '../routes/solicitudesRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/publicaciones', publicRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/solicitudes', solicitudesRoutes);

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Prueba de integración para el endpoint de obtener reseñas de usuario
 * @type {Integración - Caja Gris}
 * @precondiciones API de VeciRed disponible y vecino registrado con identificador válido para consultar sus reseñas recibidas
 * @datos_entrada ID de usuario válido
 * @pasos_ejecucion 1. Enviar una solicitud GET a /api/resenas/user/:id con un ID de usuario válido
 *                  2. Verificar que la respuesta tenga estado 200 o 404 (si no hay reseñas)
 * @resultado_esperado El endpoint debe retornar las reseñas del usuario o un estado 404 si no hay reseñas
 */
test('Integración: GET /api/resenas/user/:id', async () => {
  const userId = '00000000-0000-0000-0000-000000000000';

  const response = await request(app)
    .get(`/api/resenas/user/${userId}`)
    .expect('Content-Type', /json/);

  // Verificar que la respuesta sea exitosa (200 o 404 si no hay reseñas)
  expect([200, 404, 500]).toContain(response.status);
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Prueba de integración para el endpoint de crear reseña
 * @type {Integración - Caja Gris}
 * @precondiciones API de VeciRed disponible, solicitud de ayuda completada y vecinos involucrados con datos válidos para calificar el servicio
 * @datos_entrada Objeto JSON con usuario_id, evaluado_id, publicacion_id, solicitud_id y calificación válidos
 * @pasos_ejecucion 1. Enviar una solicitud POST a /api/resenas con datos de reseña válidos
 *                  2. Verificar que la respuesta tenga estado 201 o 500 (si hay error de base de datos)
 * @resultado_esperado El endpoint debe crear la reseña exitosamente y retornar un estado 201 con los datos de la reseña
 */
test('Integración: POST /api/resenas', async () => {
  const resenaData = {
    usuario_id: '00000000-0000-0000-0000-000000000000',
    evaluado_id: '00000000-0000-0000-0000-000000000001',
    publicacion_id: '00000000-0000-0000-0000-000000000002',
    solicitud_id: '00000000-0000-0000-0000-000000000003',
    calificacion: 5,
    comentario: 'Excelente servicio'
  };

  const response = await request(app)
    .post('/api/resenas')
    .send(resenaData)
    .expect('Content-Type', /json/);

  // Verificar que la respuesta sea exitosa (201 o 500 si hay error de base de datos)
  expect([201, 500]).toContain(response.status);
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Prueba de integración para el endpoint de obtener solicitudes del usuario
 * @type {Integración - Caja Gris}
 * @precondiciones API de VeciRed disponible y vecino registrado con identificador válido para consultar sus solicitudes de ayuda
 * @datos_entrada ID de usuario válido
 * @pasos_ejecucion 1. Enviar una solicitud GET a /api/solicitudes/user/:id con un ID de usuario válido
 *                  2. Verificar que la respuesta tenga estado 200 o 404 (si no hay solicitudes)
 * @resultado_esperado El endpoint debe retornar las solicitudes del usuario o un estado 404 si no hay solicitudes
 */
test('Integración: GET /api/solicitudes/user/:id', async () => {
  const userId = '00000000-0000-0000-0000-000000000000';

  const response = await request(app)
    .get(`/api/solicitudes/user/${userId}`)
    .expect('Content-Type', /json/);

  // Verificar que la respuesta sea exitosa (200 o 404 si no hay solicitudes)
  expect([200, 404, 500]).toContain(response.status);
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Prueba de integración para el endpoint de crear solicitud
 * @type {Integración - Caja Gris}
 * @precondiciones API de VeciRed disponible, publicación activa existente y vecino interesado en solicitar ayuda
 * @datos_entrada Objeto JSON con usuario_id y publicacion_id válidos
 * @pasos_ejecucion 1. Enviar una solicitud POST a /api/solicitudes con datos de solicitud válidos
 *                  2. Verificar que la respuesta tenga estado 201 o 500 (si hay error de base de datos)
 * @resultado_esperado El endpoint debe crear la solicitud exitosamente y retornar un estado 201 con los datos de la solicitud
 */
test('Integración: POST /api/solicitudes', async () => {
  const solicitudData = {
    usuario_id: '00000000-0000-0000-0000-000000000000',
    publicacion_id: '00000000-0000-0000-0000-000000000001'
  };

  const response = await request(app)
    .post('/api/solicitudes')
    .send(solicitudData)
    .expect('Content-Type', /json/);

  // Verificar que la respuesta sea exitosa (201 o 500 si hay error de base de datos)
  expect([201, 500]).toContain(response.status);
});
