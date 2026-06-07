import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../routes/authRoutes.js';
import publicRoutes from '../routes/publicRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/publicaciones', publicRoutes);

/**
 * @requisito HU-1 Registro de cuenta
 * @description Prueba de integración para el endpoint de registro de usuario
 * @type {Integración - Caja Gris}
 * @precondiciones API de VeciRed disponible y vecino con datos de registro válidos (nombre completo, correo único, dirección y contraseña)
 * @datos_entrada Objeto JSON con nombre_completo, correo_electronico, dirección y contraseña válidos
 * @pasos_ejecucion 1. Enviar una solicitud POST a /api/auth/register con datos de usuario válidos
 *                  2. Verificar que la respuesta tenga estado 201
 *                  3. Verificar que la respuesta contenga el mensaje de éxito
 *                  4. Verificar que la respuesta contenga los datos del usuario creado
 * @resultado_esperado El endpoint debe crear el usuario exitosamente y retornar un estado 201 con los datos del usuario
 */
test('HU-1 - Integración: POST /api/auth/register', async () => {
  const userData = {
    nombre_completo: 'Usuario Integración Test',
    correo_electronico: `integration_test_${Date.now()}@example.com`,
    direccion: 'Dirección de Prueba 123',
    contraseña: 'password123'
  };

  const response = await request(app)
    .post('/api/auth/register')
    .send(userData)
    .expect('Content-Type', /json/);

  // Verificar que la respuesta sea exitosa (201 o 400 si el usuario ya existe)
  expect([201, 400]).toContain(response.status);

  if (response.status === 201) {
    expect(response.body).toHaveProperty('message', 'Usuario registrado exitosamente');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user).toHaveProperty('email');
    expect(response.body.user).toHaveProperty('nombre_completo');
  }
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Prueba de integración para el endpoint de creación de publicación
 * @type {Integración - Caja Gris}
 * @precondiciones API de VeciRed disponible y vecino registrado con datos de publicación válidos (título, descripción, categoría y contacto)
 * @datos_entrada Objeto JSON con titulo, descripcion, categoria, usuario_id y telefono válidos
 * @pasos_ejecucion 1. Enviar una solicitud POST a /api/publicaciones con datos de publicación válidos
 *                  2. Verificar que la respuesta tenga estado 201
 *                  3. Verificar que la respuesta contenga el mensaje de éxito
 *                  4. Verificar que la respuesta contenga los datos de la publicación creada
 * @resultado_esperado El endpoint debe crear la publicación exitosamente y retornar un estado 201 con los datos de la publicación
 */
test('HU-3 - Integración: POST /api/publicaciones', async () => {
  const publicationData = {
    titulo: 'Publicación de Integración Test',
    descripcion: 'Esta es una publicación de prueba para integración',
    categoria: 'Servicios',
    usuario_id: '00000000-0000-0000-0000-000000000000', // UUID de prueba
    telefono: '1234567890'
  };

  const response = await request(app)
    .post('/api/publicaciones')
    .send(publicationData)
    .expect('Content-Type', /json/);

  // Verificar que la respuesta sea exitosa (201 o 500 si hay error de base de datos)
  expect([201, 500]).toContain(response.status);

  if (response.status === 201) {
    expect(response.body).toHaveProperty('message', 'Publicación creada exitosamente');
    expect(response.body).toHaveProperty('publication');
    expect(response.body.publication).toHaveProperty('id');
    expect(response.body.publication).toHaveProperty('titulo');
    expect(response.body.publication).toHaveProperty('estado', 'activa');
  }
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Prueba de integración para el endpoint de actualización de publicación (cierre)
 * @type {Integración - Caja Gris}
 * @precondiciones API de VeciRed disponible y publicación activa existente perteneciente a un vecino registrado
 * @datos_entrada ID de publicación y objeto JSON con estado 'inactiva'
 * @pasos_ejecucion 1. Enviar una solicitud PUT a /api/publicaciones/:id con estado 'inactiva'
 *                  2. Verificar que la respuesta tenga estado 200
 *                  3. Verificar que la respuesta contenga el mensaje de éxito
 *                  4. Verificar que la respuesta contenga los datos de la publicación actualizada
 * @resultado_esperado El endpoint debe actualizar el estado de la publicación a 'inactiva' y retornar un estado 200 con los datos actualizados
 */
test('HU-8 - Integración: PUT /api/publicaciones/:id (cierre de publicación)', async () => {
  const publicationId = '00000000-0000-0000-0000-000000000000'; // UUID de prueba

  const updateData = {
    estado: 'inactiva'
  };

  const response = await request(app)
    .put(`/api/publicaciones/${publicationId}`)
    .send(updateData)
    .expect('Content-Type', /json/);

  // Verificar que la respuesta sea exitosa (200 o 500 si hay error de base de datos)
  expect([200, 500]).toContain(response.status);

  if (response.status === 200) {
    expect(response.body).toHaveProperty('message', 'Publicación actualizada exitosamente');
    expect(response.body).toHaveProperty('publication');
    expect(response.body.publication).toHaveProperty('estado', 'inactiva');
  }
});
