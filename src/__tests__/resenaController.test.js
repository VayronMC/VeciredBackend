import { createResena, getResenasByUser, updateSolicitudEstado } from '../controllers/resenaController.js';
import { createSupabaseClient } from '../config/supabase.js';
import { createMockSupabase } from './setup/supabaseMock.js';

jest.mock('../config/supabase.js');

const mockRes = () => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

beforeEach(() => {
  jest.clearAllMocks();
  createSupabaseClient.mockReturnValue(createMockSupabase());
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica que createResena rechace peticiones con campos obligatorios faltantes
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Petición de creación de reseña con body incompleto (sin usuario_id ni solicitud_id)
 * @datos_entrada Body con evaluado_id, publicacion_id y calificacion; faltan usuario_id y solicitud_id
 * @pasos_ejecucion 1. Construir req.body con campos obligatorios ausentes
 *                  2. Invocar createResena(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json retorne el mensaje de campos obligatorios faltantes
 * @resultado_esperado HTTP 400 con error indicando los campos obligatorios requeridos para crear una reseña
 */
test('Validación de campos obligatorios al crear reseña', () => {
  const req = {
    body: {
      evaluado_id: '00000000-0000-0000-0000-000000000000',
      publicacion_id: '00000000-0000-0000-0000-000000000000',
      calificacion: 5
      // Falta usuario_id, solicitud_id
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createResena(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Faltan campos obligatorios: usuario_id, evaluado_id, publicacion_id, solicitud_id, calificacion'
  });
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica que createResena rechace calificaciones fuera del rango permitido (1-5)
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Petición de creación de reseña con calificación numérica inválida (mayor a 5)
 * @datos_entrada Body completo con calificacion: 6
 * @pasos_ejecucion 1. Construir req.body con todos los campos obligatorios y calificacion = 6
 *                  2. Invocar createResena(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json indique el rango válido de calificación
 * @resultado_esperado HTTP 400 con error "La calificación debe estar entre 1 y 5"
 */
test('Validación de rango de calificación al crear reseña', () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      evaluado_id: '00000000-0000-0000-0000-000000000000',
      publicacion_id: '00000000-0000-0000-0000-000000000000',
      solicitud_id: '00000000-0000-0000-0000-000000000000',
      calificacion: 6 // Fuera de rango
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createResena(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'La calificación debe estar entre 1 y 5'
  });
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica que getResenasByUser rechace consultas sin identificador de usuario
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Consulta de reseñas por usuario sin parámetro id en la ruta
 * @datos_entrada req.params vacío (sin id de usuario)
 * @pasos_ejecucion 1. Construir req.params sin el campo id
 *                  2. Invocar getResenasByUser(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json indique que el ID de usuario es obligatorio
 * @resultado_esperado HTTP 400 con error "ID de usuario es obligatorio"
 */
test('Validación de usuario_id al obtener reseñas de usuario', () => {
  const req = {
    params: {}
    // Falta id
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  getResenasByUser(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'ID de usuario es obligatorio'
  });
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica que createResena rechace peticiones sin evaluado_id
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Petición de creación de reseña con evaluado_id ausente en el body
 * @datos_entrada Body con usuario_id, publicacion_id, solicitud_id y calificacion; falta evaluado_id
 * @pasos_ejecucion 1. Construir req.body omitiendo evaluado_id
 *                  2. Invocar createResena(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json liste los campos obligatorios faltantes
 * @resultado_esperado HTTP 400 con error de campos obligatorios incluyendo evaluado_id
 */
test('Validación de evaluado_id obligatorio al crear reseña', () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      publicacion_id: '00000000-0000-0000-0000-000000000000',
      solicitud_id: '00000000-0000-0000-0000-000000000000',
      calificacion: 5
      // Falta evaluado_id
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createResena(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Faltan campos obligatorios: usuario_id, evaluado_id, publicacion_id, solicitud_id, calificacion'
  });
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica que createResena rechace peticiones sin publicacion_id
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Petición de creación de reseña con publicacion_id ausente en el body
 * @datos_entrada Body con usuario_id, evaluado_id, solicitud_id y calificacion; falta publicacion_id
 * @pasos_ejecucion 1. Construir req.body omitiendo publicacion_id
 *                  2. Invocar createResena(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json liste los campos obligatorios faltantes
 * @resultado_esperado HTTP 400 con error de campos obligatorios incluyendo publicacion_id
 */
test('Validación de publicacion_id obligatorio al crear reseña', () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      evaluado_id: '00000000-0000-0000-0000-000000000000',
      solicitud_id: '00000000-0000-0000-0000-000000000000',
      calificacion: 5
      // Falta publicacion_id
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createResena(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Faltan campos obligatorios: usuario_id, evaluado_id, publicacion_id, solicitud_id, calificacion'
  });
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica la creación exitosa de una reseña con datos válidos
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Solicitud de ayuda completada y datos de reseña válidos; Supabase responde insert exitoso
 * @datos_entrada Body con usuario_id, evaluado_id, publicacion_id, solicitud_id, calificacion y comentario
 * @pasos_ejecucion 1. Configurar mock de Supabase con insert exitoso en tabla resenas
 *                  2. Construir req.body con todos los campos válidos
 *                  3. Invocar await createResena(req, res)
 *                  4. Verificar que res.status reciba 201
 *                  5. Verificar que res.json contenga mensaje de reseña creada exitosamente
 * @resultado_esperado HTTP 201 con mensaje de confirmación de creación de reseña
 */
test('Caso de éxito en createResena', async () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      evaluado_id: '00000000-0000-0000-0000-000000000000',
      publicacion_id: '00000000-0000-0000-0000-000000000000',
      solicitud_id: '00000000-0000-0000-0000-000000000000',
      calificacion: 5,
      comentario: 'Excelente servicio'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await createResena(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Reseña creada exitosamente' }),
  );
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica la consulta exitosa de reseñas asociadas a un usuario evaluado
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Usuario evaluado existente con reseñas registradas; Supabase responde select exitoso
 * @datos_entrada req.params.id con identificador del usuario evaluado
 * @pasos_ejecucion 1. Configurar mock de Supabase con select exitoso en tabla resenas
 *                  2. Construir req.params con id de usuario válido
 *                  3. Invocar await getResenasByUser(req, res)
 *                  4. Verificar que res.status reciba 200
 *                  5. Verificar que res.json retorne arreglo de reseñas y conteo
 * @resultado_esperado HTTP 200 con objeto { resenas: Array, count: Number }
 */
test('Caso de éxito en getResenasByUser', async () => {
  const req = {
    params: {
      id: 'test-user-id'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await getResenasByUser(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ resenas: expect.any(Array), count: expect.any(Number) }),
  );
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica el manejo de error cuando Supabase falla al persistir una reseña
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Body de reseña válido; operación insert en Supabase retorna error de restricción
 * @datos_entrada Body completo con usuario_id, evaluado_id, publicacion_id, solicitud_id, calificacion y comentario
 * @pasos_ejecucion 1. Configurar mock de Supabase con error en insert de tabla resenas
 *                  2. Construir req.body con datos válidos de reseña
 *                  3. Invocar await createResena(req, res)
 *                  4. Verificar que res.status reciba 500
 *                  5. Verificar que res.json retorne error genérico de creación de reseña
 * @resultado_esperado HTTP 500 con error "Error al crear reseña"
 */
test('Error al guardar reseña en Supabase (línea 34-38)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        resenas: {
          insert: { data: null, error: { message: 'Insert constraint violation' } },
        },
      },
    }),
  );

  const req = {
    body: {
      usuario_id: 'test-user-id',
      evaluado_id: 'other-user-id',
      publicacion_id: 'test-publication-id',
      solicitud_id: 'test-solicitud-id',
      calificacion: 5,
      comentario: 'Test',
    },
  };
  const res = mockRes();

  await createResena(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al crear reseña' }),
  );
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica el manejo de error cuando Supabase falla al consultar reseñas de un usuario
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Identificador de usuario válido en params; operación select en Supabase retorna error
 * @datos_entrada req.params.id con identificador de usuario
 * @pasos_ejecucion 1. Configurar mock de Supabase con error en select de tabla resenas
 *                  2. Construir req.params con id de usuario
 *                  3. Invocar await getResenasByUser(req, res)
 *                  4. Verificar que res.status reciba 500
 *                  5. Verificar que res.json retorne error genérico de obtención de reseñas
 * @resultado_esperado HTTP 500 con error "Error al obtener reseñas"
 */
test('Error al obtener reseñas del usuario (línea 73)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        resenas: {
          select: { data: null, error: { message: 'Query failed' } },
        },
      },
    }),
  );

  const req = { params: { id: 'test-user-id' } };
  const res = mockRes();

  await getResenasByUser(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al obtener reseñas' }),
  );
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica que updateSolicitudEstado rechace estados distintos de pendiente o completada
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Solicitud existente; body con estado no permitido por el dominio
 * @datos_entrada req.params.id con identificador de solicitud; req.body.estado = "cancelada"
 * @pasos_ejecucion 1. Construir req con id de solicitud y estado inválido "cancelada"
 *                  2. Invocar updateSolicitudEstado(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json indique los estados permitidos
 * @resultado_esperado HTTP 400 con error "Estado debe ser \"pendiente\" o \"completada\""
 */
test('Validación de estado inválido en updateSolicitudEstado (líneas 105-108)', () => {
  const req = { params: { id: 'test-solicitud-id' }, body: { estado: 'cancelada' } };
  const res = mockRes();

  updateSolicitudEstado(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Estado debe ser "pendiente" o "completada"' }),
  );
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica que updateSolicitudEstado rechace peticiones sin campo estado
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Solicitud existente; body vacío sin campo estado
 * @datos_entrada req.params.id con identificador de solicitud; req.body sin estado
 * @pasos_ejecucion 1. Construir req con id de solicitud y body vacío
 *                  2. Invocar updateSolicitudEstado(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json indique que el estado es obligatorio
 * @resultado_esperado HTTP 400 con error "Estado es obligatorio"
 */
test('Validación de estado obligatorio en updateSolicitudEstado (líneas 99-102)', () => {
  const req = { params: { id: 'test-solicitud-id' }, body: {} };
  const res = mockRes();

  updateSolicitudEstado(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Estado es obligatorio' }));
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica la actualización exitosa del estado de una solicitud a completada
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Solicitud existente en estado pendiente; Supabase responde update exitoso
 * @datos_entrada req.params.id con identificador de solicitud; req.body.estado = "completada"
 * @pasos_ejecucion 1. Configurar mock de Supabase con update exitoso en tabla solicitudes
 *                  2. Construir req con id y estado "completada"
 *                  3. Invocar await updateSolicitudEstado(req, res)
 *                  4. Verificar que res.status reciba 200
 *                  5. Verificar que res.json confirme actualización exitosa del estado
 * @resultado_esperado HTTP 200 con mensaje "Estado de solicitud actualizado exitosamente"
 */
test('Caso de éxito en updateSolicitudEstado (líneas 125-128)', async () => {
  const req = { params: { id: 'test-solicitud-id' }, body: { estado: 'completada' } };
  const res = mockRes();

  await updateSolicitudEstado(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Estado de solicitud actualizado exitosamente' }),
  );
});

/**
 * @requisito HU-5 Sistema de reseñas
 * @description Verifica el manejo de error cuando Supabase falla al actualizar el estado de una solicitud
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Solicitud existente; operación update en Supabase retorna error
 * @datos_entrada req.params.id con identificador de solicitud; req.body.estado = "pendiente"
 * @pasos_ejecucion 1. Configurar mock de Supabase con error en update de tabla solicitudes
 *                  2. Construir req con id y estado "pendiente"
 *                  3. Invocar await updateSolicitudEstado(req, res)
 *                  4. Verificar que res.status reciba 500
 *                  5. Verificar que res.json retorne error genérico de actualización de estado
 * @resultado_esperado HTTP 500 con error "Error al actualizar estado de solicitud"
 */
test('Error al actualizar estado de solicitud (líneas 118-122)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        solicitudes: {
          update: { data: null, error: { message: 'Update failed' } },
        },
      },
    }),
  );

  const req = { params: { id: 'test-solicitud-id' }, body: { estado: 'pendiente' } };
  const res = mockRes();

  await updateSolicitudEstado(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al actualizar estado de solicitud' }),
  );
});
