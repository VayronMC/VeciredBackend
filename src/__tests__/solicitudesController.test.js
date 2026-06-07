import { createRequest, getUserRequests } from '../controllers/solicitudesController.js';
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
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica que createRequest rechace peticiones con campos obligatorios faltantes
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Petición de creación de solicitud con body incompleto (sin usuario_id)
 * @datos_entrada Body con publicacion_id; falta usuario_id
 * @pasos_ejecucion 1. Construir req.body con publicacion_id y sin usuario_id
 *                  2. Invocar createRequest(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json indique que usuario_id y publicacion_id son obligatorios
 * @resultado_esperado HTTP 400 con error "usuario_id y publicacion_id son obligatorios"
 */
test('Validación de campos obligatorios al crear solicitud', () => {
  const req = {
    body: {
      publicacion_id: '00000000-0000-0000-0000-000000000000'
      // Falta usuario_id
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createRequest(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'usuario_id y publicacion_id son obligatorios'
  });
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica que getUserRequests rechace consultas sin identificador de usuario
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Consulta de solicitudes del usuario sin parámetro usuario_id en la ruta
 * @datos_entrada req.params vacío (sin usuario_id)
 * @pasos_ejecucion 1. Construir req.params sin el campo usuario_id
 *                  2. Invocar getUserRequests(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json indique que usuario_id es obligatorio
 * @resultado_esperado HTTP 400 con error "usuario_id es obligatorio"
 */
test('Validación de usuario_id al obtener solicitudes del usuario', () => {
  const req = {
    params: {}
    // Falta usuario_id
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  getUserRequests(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'usuario_id es obligatorio'
  });
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica que createRequest rechace peticiones sin publicacion_id
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Petición de creación de solicitud con publicacion_id ausente en el body
 * @datos_entrada Body con usuario_id; falta publicacion_id
 * @pasos_ejecucion 1. Construir req.body con usuario_id y sin publicacion_id
 *                  2. Invocar createRequest(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json indique que usuario_id y publicacion_id son obligatorios
 * @resultado_esperado HTTP 400 con error "usuario_id y publicacion_id son obligatorios"
 */
test('Validación de publicacion_id obligatorio al crear solicitud', () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000'
      // Falta publicacion_id
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createRequest(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'usuario_id y publicacion_id son obligatorios'
  });
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica que createRequest rechace peticiones sin usuario_id
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Petición de creación de solicitud con usuario_id ausente en el body
 * @datos_entrada Body con publicacion_id; falta usuario_id
 * @pasos_ejecucion 1. Construir req.body con publicacion_id y sin usuario_id
 *                  2. Invocar createRequest(req, res)
 *                  3. Verificar que res.status reciba 400
 *                  4. Verificar que res.json indique que usuario_id y publicacion_id son obligatorios
 * @resultado_esperado HTTP 400 con error "usuario_id y publicacion_id son obligatorios"
 */
test('Validación de usuario_id obligatorio al crear solicitud', () => {
  const req = {
    body: {
      publicacion_id: '00000000-0000-0000-0000-000000000000'
      // Falta usuario_id
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createRequest(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'usuario_id y publicacion_id son obligatorios'
  });
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica la creación exitosa de una solicitud de ayuda con datos válidos
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Usuario y publicación existentes; no hay solicitud previa; Supabase responde insert exitoso
 * @datos_entrada Body con usuario_id y publicacion_id válidos
 * @pasos_ejecucion 1. Configurar mock de Supabase con verificación sin duplicado e insert exitoso
 *                  2. Construir req.body con usuario_id y publicacion_id
 *                  3. Invocar await createRequest(req, res)
 *                  4. Verificar que res.status reciba 201
 *                  5. Verificar que res.json contenga mensaje de solicitud creada exitosamente
 * @resultado_esperado HTTP 201 con mensaje "Solicitud creada exitosamente"
 */
test('Caso de éxito en createRequest', async () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      publicacion_id: '00000000-0000-0000-0000-000000000000'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await createRequest(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Solicitud creada exitosamente' }),
  );
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica la consulta exitosa de solicitudes asociadas a un usuario
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Usuario existente con solicitudes registradas; Supabase responde select exitoso
 * @datos_entrada req.params.usuario_id con identificador del usuario
 * @pasos_ejecucion 1. Configurar mock de Supabase con select exitoso en tabla solicitudes
 *                  2. Construir req.params con usuario_id válido
 *                  3. Invocar await getUserRequests(req, res)
 *                  4. Verificar que res.status reciba 200
 *                  5. Verificar que res.json retorne arreglo de solicitudes y conteo
 * @resultado_esperado HTTP 200 con objeto { solicitudes: Array, count: Number }
 */
test('Caso de éxito en getUserRequests', async () => {
  const req = {
    params: {
      usuario_id: 'test-user-id'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await getUserRequests(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ solicitudes: expect.any(Array), count: expect.any(Number) }),
  );
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica el manejo de error cuando Supabase falla al verificar solicitud existente
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Body con usuario_id y publicacion_id válidos; consulta selectSingle retorna error distinto a PGRST116
 * @datos_entrada Body con usuario_id y publicacion_id
 * @pasos_ejecucion 1. Configurar mock de Supabase con error PGRST500 en selectSingle de tabla solicitudes
 *                  2. Construir req.body con datos válidos
 *                  3. Invocar await createRequest(req, res)
 *                  4. Verificar que res.status reciba 500
 *                  5. Verificar que res.json retorne error de verificación de solicitud existente
 * @resultado_esperado HTTP 500 con error "Error al verificar solicitud existente"
 */
test('Error al verificar solicitud existente (línea 24)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        solicitudes: {
          selectSingle: { data: null, error: { message: 'DB error', code: 'PGRST500' } },
        },
      },
    }),
  );

  const req = {
    body: {
      usuario_id: 'test-user-id',
      publicacion_id: 'test-publication-id',
    },
  };
  const res = mockRes();

  await createRequest(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al verificar solicitud existente' }),
  );
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica el rechazo de solicitud duplicada para la misma publicación
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Usuario ya tiene una solicitud activa para la publicación indicada
 * @datos_entrada Body con usuario_id y publicacion_id de solicitud ya existente
 * @pasos_ejecucion 1. Configurar mock de Supabase con selectSingle retornando solicitud existente
 *                  2. Construir req.body con mismo usuario_id y publicacion_id
 *                  3. Invocar await createRequest(req, res)
 *                  4. Verificar que res.status reciba 409
 *                  5. Verificar que res.json indique que la publicación ya fue tomada
 * @resultado_esperado HTTP 409 con error "Ya has tomado esta publicación"
 */
test('Solicitud duplicada para misma publicación (línea 31)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        solicitudes: {
          selectSingle: {
            data: { id: 'existing-id', usuario_id: 'test-user-id', publicacion_id: 'test-publication-id' },
            error: null,
          },
        },
      },
    }),
  );

  const req = {
    body: {
      usuario_id: 'test-user-id',
      publicacion_id: 'test-publication-id',
    },
  };
  const res = mockRes();

  await createRequest(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Ya has tomado esta publicación' }),
  );
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica el manejo de error cuando Supabase falla al insertar una nueva solicitud
 * @type {Unitaria - Caja Blanca}
 * @precondiciones No existe solicitud previa (PGRST116); operación insert retorna error
 * @datos_entrada Body con usuario_id y publicacion_id válidos sin solicitud duplicada
 * @pasos_ejecucion 1. Configurar mock con selectSingle sin resultados y error en insert
 *                  2. Construir req.body con datos válidos
 *                  3. Invocar await createRequest(req, res)
 *                  4. Verificar que res.status reciba 500
 *                  5. Verificar que res.json retorne error genérico de creación de solicitud
 * @resultado_esperado HTTP 500 con error "Error al crear solicitud"
 */
test('Error al insertar solicitud en Supabase (línea 53)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        solicitudes: {
          selectSingle: { data: null, error: { message: 'No rows', code: 'PGRST116' } },
          insert: { data: null, error: { message: 'Insert failed' } },
        },
      },
    }),
  );

  const req = {
    body: {
      usuario_id: 'test-user-id',
      publicacion_id: 'test-publication-id',
    },
  };
  const res = mockRes();

  await createRequest(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al crear solicitud' }),
  );
});

/**
 * @requisito HU-4 Gestión de solicitudes de ayuda
 * @description Verifica el manejo de error cuando Supabase falla al consultar solicitudes de un usuario
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Identificador de usuario válido en params; operación select retorna error
 * @datos_entrada req.params.usuario_id con identificador de usuario
 * @pasos_ejecucion 1. Configurar mock de Supabase con error en select de tabla solicitudes
 *                  2. Construir req.params con usuario_id
 *                  3. Invocar await getUserRequests(req, res)
 *                  4. Verificar que res.status reciba 500
 *                  5. Verificar que res.json retorne error genérico de obtención de solicitudes
 * @resultado_esperado HTTP 500 con error "Error al obtener solicitudes del usuario"
 */
test('Error al obtener solicitudes del usuario (línea 86)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        solicitudes: {
          select: { data: null, error: { message: 'Query failed' } },
        },
      },
    }),
  );

  const req = { params: { usuario_id: 'test-user-id' } };
  const res = mockRes();

  await getUserRequests(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al obtener solicitudes del usuario' }),
  );
});
