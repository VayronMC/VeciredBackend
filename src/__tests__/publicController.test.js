import {
  getAllPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  getNotifications,
  getUserPublications,
} from '../controllers/publicController.js';
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
 * @requisito HU-8 Gestión de publicaciones
 * @description Validación de campos obligatorios al crear una publicación
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta publicar un favor sin completar los datos mínimos requeridos
 * @datos_entrada Solicitud de creación con título únicamente; faltan descripción, categoría y usuario_id
 * @pasos_ejecucion 1. Enviar solicitud de creación con cuerpo incompleto (solo título)
 *                  2. Invocar createPublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar el mensaje de error en el cuerpo de la respuesta
 * @resultado_esperado El sistema rechaza la operación con estado 400 e indica que descripción, categoría y usuario_id son obligatorios
 */
test('Validación de campos obligatorios al crear publicación', () => {
  const req = {
    body: {
      titulo: 'Publicación Test',
      // Falta descripción, categoría y usuario_id
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createPublication(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Descripción, categoría y usuario_id son obligatorios'
  });
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Validación de categoría permitida al crear una publicación
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta publicar contenido con una categoría no reconocida por el sistema
 * @datos_entrada Solicitud de creación con descripción, usuario_id y categoría "Categoría Inválida"
 * @pasos_ejecucion 1. Enviar solicitud de creación con categoría fuera del catálogo permitido
 *                  2. Invocar createPublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar que el mensaje de error enumere las categorías válidas
 * @resultado_esperado El sistema rechaza la operación con estado 400 e indica que la categoría debe ser Servicios, Favores o Préstamos
 */
test('Validación de categoría válida al crear publicación', () => {
  const req = {
    body: {
      descripcion: 'Descripción Test',
      categoria: 'Categoría Inválida',
      usuario_id: '00000000-0000-0000-0000-000000000000'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createPublication(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Categoría no válida. Debe ser: Servicios, Favores o Préstamos'
  });
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Validación de usuario_id obligatorio al consultar notificaciones
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino solicita sus notificaciones sin identificar su cuenta en la petición
 * @datos_entrada Solicitud GET de notificaciones con query vacío (sin usuario_id)
 * @pasos_ejecucion 1. Enviar solicitud de consulta de notificaciones sin parámetro usuario_id
 *                  2. Invocar getNotifications con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar el mensaje de error en el cuerpo de la respuesta
 * @resultado_esperado El sistema rechaza la consulta con estado 400 e indica que usuario_id es obligatorio
 */
test('Validación de usuario_id obligatorio al obtener notificaciones', () => {
  const req = {
    query: {}
    // Falta usuario_id
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  getNotifications(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'usuario_id es obligatorio'
  });
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Validación de usuario_id obligatorio al consultar publicaciones propias
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta ver su historial de publicaciones sin proporcionar su identificador
 * @datos_entrada Solicitud GET de publicaciones del usuario con params vacío (sin usuario_id)
 * @pasos_ejecucion 1. Enviar solicitud de consulta de publicaciones propias sin usuario_id en la ruta
 *                  2. Invocar getUserPublications con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar el mensaje de error en el cuerpo de la respuesta
 * @resultado_esperado El sistema rechaza la consulta con estado 400 e indica que usuario_id es obligatorio
 */
test('Validación de usuario_id obligatorio al obtener publicaciones del usuario', () => {
  const req = {
    params: {}
    // Falta usuario_id
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  getUserPublications(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'usuario_id es obligatorio'
  });
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Consulta del catálogo completo de publicaciones activas del vecindario
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existen publicaciones activas registradas en la plataforma y el servicio de datos responde correctamente
 * @datos_entrada Solicitud GET de publicaciones sin filtros ni parámetros de búsqueda
 * @pasos_ejecucion 1. Enviar solicitud de listado general sin filtros en query
 *                  2. Invocar getAllPublications con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar que la respuesta incluya arreglo de publicaciones y contador total
 * @resultado_esperado El sistema responde con estado 200 y un objeto JSON con las propiedades publications (arreglo) y count (número)
 */
test('Obtener todas las publicaciones (caso de éxito)', async () => {
  const req = {
    query: {}
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await getAllPublications(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ publications: expect.any(Array), count: expect.any(Number) }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Filtrado de publicaciones por categoría de servicio
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existen publicaciones activas en la categoría Servicios dentro del vecindario
 * @datos_entrada Solicitud GET con parámetro de query categoria=Servicios
 * @pasos_ejecucion 1. Enviar solicitud de listado con filtro de categoría "Servicios"
 *                  2. Invocar getAllPublications con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar que la respuesta incluya arreglo de publicaciones y contador total
 * @resultado_esperado El sistema responde con estado 200 y retorna el conjunto filtrado de publicaciones con su contador
 */
test('Obtener publicaciones con filtro de categoría', async () => {
  const req = {
    query: { categoria: 'Servicios' }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await getAllPublications(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ publications: expect.any(Array), count: expect.any(Number) }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Búsqueda de publicaciones por término de texto
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existen publicaciones activas cuyo contenido coincide con el término de búsqueda
 * @datos_entrada Solicitud GET con parámetro de query search=test
 * @pasos_ejecucion 1. Enviar solicitud de listado con término de búsqueda "test"
 *                  2. Invocar getAllPublications con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar que la respuesta incluya arreglo de publicaciones y contador total
 * @resultado_esperado El sistema responde con estado 200 y retorna las publicaciones que coinciden con el criterio de búsqueda
 */
test('Obtener publicaciones con búsqueda', async () => {
  const req = {
    query: { search: 'test' }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await getAllPublications(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ publications: expect.any(Array), count: expect.any(Number) }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Actualización exitosa de una publicación existente
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existe una publicación activa identificada y el vecino autor modifica su título
 * @datos_entrada Solicitud PUT con id en params y cuerpo con titulo actualizado
 * @pasos_ejecucion 1. Enviar solicitud de actualización con identificador de publicación y nuevo título
 *                  2. Invocar updatePublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar el mensaje de confirmación en el cuerpo de la respuesta
 * @resultado_esperado El sistema confirma la actualización con estado 200 y mensaje "Publicación actualizada exitosamente"
 */
test('Validación de campos al actualizar publicación', async () => {
  const req = {
    params: { id: 'test-id' },
    body: {
      titulo: 'Título actualizado'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await updatePublication(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Publicación actualizada exitosamente' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Eliminación exitosa de una publicación existente
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existe una publicación activa que el vecino autor desea retirar del vecindario
 * @datos_entrada Solicitud DELETE con id de publicación en params
 * @pasos_ejecucion 1. Enviar solicitud de eliminación con identificador de publicación válido
 *                  2. Invocar deletePublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar el mensaje de confirmación en el cuerpo de la respuesta
 * @resultado_esperado El sistema confirma la eliminación con estado 200 y mensaje "Publicación eliminada exitosamente"
 */
test('Validación de campos al eliminar publicación', async () => {
  const req = {
    params: { id: 'test-id' }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await deletePublication(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Publicación eliminada exitosamente' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Rechazo de creación por categoría inválida con datos completos
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta publicar un servicio con todos los campos llenos excepto una categoría no permitida
 * @datos_entrada Solicitud de creación con usuario_id, título, descripción, medio_contacto y categoría "Categoría Inválida"
 * @pasos_ejecucion 1. Enviar solicitud de creación con categoría fuera del catálogo permitido
 *                  2. Invocar createPublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar que el mensaje de error enumere las categorías válidas
 * @resultado_esperado El sistema rechaza la operación con estado 400 e indica que la categoría debe ser Servicios, Favores o Préstamos
 */
test('Validación de categoría inválida al crear publicación', () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      titulo: 'Título Test',
      descripcion: 'Descripción Test',
      categoria: 'Categoría Inválida',
      medio_contacto: '1234567890'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createPublication(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Categoría no válida. Debe ser: Servicios, Favores o Préstamos'
  });
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Creación de publicación sin título (campo opcional)
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino publica un servicio omitiendo el título, campo no obligatorio según reglas de negocio
 * @datos_entrada Solicitud de creación con usuario_id, descripción, categoría Servicios y teléfono; sin título
 * @pasos_ejecucion 1. Enviar solicitud de creación con datos obligatorios completos y sin título
 *                  2. Invocar createPublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 * @resultado_esperado El sistema acepta la publicación y responde con estado 201 Created
 */
test('Creación de publicación sin título (campo opcional)', async () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      descripcion: 'Descripción Test',
      categoria: 'Servicios',
      telefono: '1234567890',
    },
  };

  const res = mockRes();

  await createPublication(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Validación de descripción obligatoria al crear una publicación
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta publicar contenido sin incluir la descripción del servicio o favor
 * @datos_entrada Solicitud de creación con usuario_id, título, categoría Servicios y medio_contacto; sin descripción
 * @pasos_ejecucion 1. Enviar solicitud de creación omitiendo el campo descripción
 *                  2. Invocar createPublication con la solicitud simulada
 *                  3. Verificar que el código de estado sea 400 (validación) o 500 (error de persistencia)
 * @resultado_esperado El sistema no completa la creación y responde con estado 400 o 500 según el punto de fallo detectado
 */
test('Validación de descripción obligatoria al crear publicación', () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      titulo: 'Título Test',
      categoria: 'Servicios',
      medio_contacto: '1234567890'
      // Falta descripción
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  createPublication(req, res);

  expect([400, 500]).toContain(res.status.mock.calls[0][0]);
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Creación de publicación sin teléfono de contacto (campo opcional)
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino publica un favor sin proporcionar número telefónico, campo no obligatorio según reglas de negocio
 * @datos_entrada Solicitud de creación con usuario_id, título, descripción y categoría Servicios; sin teléfono ni medio_contacto
 * @pasos_ejecucion 1. Enviar solicitud de creación con datos obligatorios completos y sin medio de contacto
 *                  2. Invocar createPublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 * @resultado_esperado El sistema acepta la publicación y responde con estado 201 Created
 */
test('Creación de publicación sin teléfono (campo opcional)', async () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      titulo: 'Título Test',
      descripcion: 'Descripción Test',
      categoria: 'Servicios',
    },
  };

  const res = mockRes();

  await createPublication(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Consulta de publicaciones con filtros combinados de categoría y búsqueda
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existen publicaciones activas en la categoría Servicios que coinciden con el término de búsqueda
 * @datos_entrada Solicitud GET con query categoria=Servicios y search=test
 * @pasos_ejecucion 1. Enviar solicitud de listado con filtros de categoría y búsqueda simultáneos
 *                  2. Invocar getAllPublications con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 * @resultado_esperado El sistema responde con estado 200 y retorna el conjunto de publicaciones que cumplen ambos criterios
 */
test('Caso de éxito en getAllPublications', async () => {
  const req = {
    query: {
      categoria: 'Servicios',
      search: 'test'
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await getAllPublications(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Creación exitosa de una publicación con datos válidos completos
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino registrado publica un servicio con todos los campos obligatorios y opcionales válidos
 * @datos_entrada Solicitud POST con usuario_id, título, descripción, categoría Servicios, medio_contacto y foto_url nula
 * @pasos_ejecucion 1. Enviar solicitud de creación con cuerpo completo y válido
 *                  2. Invocar createPublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar el mensaje de confirmación en el cuerpo de la respuesta
 * @resultado_esperado El sistema crea la publicación con estado 201 y mensaje "Publicación creada exitosamente"
 */
test('Caso de éxito en createPublication', async () => {
  const req = {
    body: {
      usuario_id: '00000000-0000-0000-0000-000000000000',
      titulo: 'Título Test',
      descripcion: 'Descripción Test',
      categoria: 'Servicios',
      medio_contacto: '1234567890',
      foto_url: null
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await createPublication(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Publicación creada exitosamente' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Actualización exitosa de publicación con datos completos
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existe una publicación activa y el vecino autor actualiza título, descripción, categoría y contacto
 * @datos_entrada Solicitud PUT con id en params y cuerpo con título, descripción, categoría Servicios, medio_contacto y foto_url nula
 * @pasos_ejecucion 1. Enviar solicitud de actualización con identificador y datos modificados completos
 *                  2. Invocar updatePublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar el mensaje de confirmación en el cuerpo de la respuesta
 * @resultado_esperado El sistema confirma la actualización con estado 200 y mensaje "Publicación actualizada exitosamente"
 */
test('Caso de éxito en updatePublication', async () => {
  const req = {
    params: { id: 'test-publication-id' },
    body: {
      titulo: 'Título Actualizado',
      descripcion: 'Descripción Actualizada',
      categoria: 'Servicios',
      medio_contacto: '1234567890',
      foto_url: null
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await updatePublication(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Publicación actualizada exitosamente' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Eliminación exitosa de publicación por identificador
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existe una publicación activa identificada que el vecino autor solicita eliminar
 * @datos_entrada Solicitud DELETE con id test-publication-id en params
 * @pasos_ejecucion 1. Enviar solicitud de eliminación con identificador de publicación válido
 *                  2. Invocar deletePublication con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar el mensaje de confirmación en el cuerpo de la respuesta
 * @resultado_esperado El sistema confirma la eliminación con estado 200 y mensaje "Publicación eliminada exitosamente"
 */
test('Caso de éxito en deletePublication', async () => {
  const req = {
    params: { id: 'test-publication-id' }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };

  await deletePublication(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Publicación eliminada exitosamente' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Manejo de error de persistencia al consultar publicaciones con filtros
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino consulta publicaciones filtradas pero el servicio de base de datos no responde
 * @datos_entrada Solicitud GET con query categoria=Servicios y search=test
 * @pasos_ejecucion 1. Configurar mock de Supabase para simular fallo en la consulta select de publicaciones
 *                  2. Enviar solicitud de listado con filtros de categoría y búsqueda
 *                  3. Invocar getAllPublications con la solicitud simulada
 *                  4. Verificar el código de estado y el mensaje de error devueltos
 * @resultado_esperado El sistema responde con estado 500 y mensaje de error "Error al obtener publicaciones"
 */
test('Error al obtener publicaciones con filtros (líneas 15-33)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        publicaciones: {
          select: { data: null, error: { message: 'DB connection failed' } },
        },
      },
    }),
  );

  const req = { query: { categoria: 'Servicios', search: 'test' } };
  const res = mockRes();

  await getAllPublications(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al obtener publicaciones' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Consulta de publicación inexistente por identificador
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino solicita el detalle de una publicación que no existe o fue eliminada
 * @datos_entrada Solicitud GET con params.id=id-inexistente
 * @pasos_ejecucion 1. Configurar mock de Supabase para simular ausencia de registro en consulta single
 *                  2. Enviar solicitud de detalle con identificador inexistente
 *                  3. Invocar getPublicationById con la solicitud simulada
 *                  4. Verificar el código de estado y el mensaje de error devueltos
 * @resultado_esperado El sistema responde con estado 404 y mensaje "Publicación no encontrada"
 */
test('Error al obtener publicación por ID inexistente (líneas 47-68)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        publicaciones: {
          select: { data: null, error: { message: 'Publication not found' } },
        },
      },
    }),
  );

  const req = { params: { id: 'id-inexistente' } };
  const res = mockRes();

  await getPublicationById(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Publicación no encontrada' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Consulta exitosa del detalle de una publicación por identificador
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existe una publicación activa registrada con identificador conocido
 * @datos_entrada Solicitud GET con params.id=test-publication-id
 * @pasos_ejecucion 1. Enviar solicitud de detalle con identificador de publicación válido
 *                  2. Invocar getPublicationById con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar que la respuesta incluya el objeto publication
 * @resultado_esperado El sistema responde con estado 200 y un objeto JSON con la propiedad publication
 */
test('Caso de éxito al obtener publicación por ID (líneas 65-66)', async () => {
  const req = { params: { id: 'test-publication-id' } };
  const res = mockRes();

  await getPublicationById(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ publication: expect.anything() }));
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Creación de publicación con generación automática de notificaciones a vecinos
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existen vecinos registrados en la plataforma susceptibles de recibir alertas por nueva publicación
 * @datos_entrada Solicitud POST con usuario_id, título, descripción, categoría Servicios y teléfono de contacto
 * @pasos_ejecucion 1. Configurar mock de Supabase con usuarios disponibles para notificar
 *                  2. Enviar solicitud de creación con datos válidos de publicación
 *                  3. Invocar createPublication con la solicitud simulada
 *                  4. Verificar que se invoque inserción en la tabla notificaciones
 *                  5. Verificar el código de estado HTTP devuelto
 * @resultado_esperado El sistema crea la publicación con estado 201 e inserta registros de notificación para los vecinos
 */
test('Creación de publicación con notificaciones (líneas 116-138)', async () => {
  const mockSupabase = createMockSupabase();
  createSupabaseClient.mockReturnValue(mockSupabase);

  const req = {
    body: {
      usuario_id: 'test-user-id',
      titulo: 'Titulo Test',
      descripcion: 'Descripcion Test',
      categoria: 'Servicios',
      telefono: '1234567890',
    },
  };
  const res = mockRes();

  await createPublication(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(mockSupabase.from).toHaveBeenCalledWith('notificaciones');
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Manejo de error de persistencia al eliminar una publicación
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta eliminar su publicación pero el servicio de base de datos falla en la operación delete
 * @datos_entrada Solicitud DELETE con id test-publication-id en params
 * @pasos_ejecucion 1. Configurar mock de Supabase para simular fallo en la operación delete de publicaciones
 *                  2. Enviar solicitud de eliminación con identificador válido
 *                  3. Invocar deletePublication con la solicitud simulada
 *                  4. Verificar el código de estado y el mensaje de error devueltos
 * @resultado_esperado El sistema responde con estado 500 y mensaje "Error al eliminar publicación"
 */
test('Error al eliminar publicación (líneas 204-211)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        publicaciones: {
          delete: { data: null, error: { message: 'Delete failed' } },
        },
      },
    }),
  );

  const req = { params: { id: 'test-publication-id' } };
  const res = mockRes();

  await deletePublication(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al eliminar publicación' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Manejo de error de persistencia al consultar notificaciones del vecino
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino autenticado consulta sus notificaciones pero el servicio de base de datos no responde
 * @datos_entrada Solicitud GET con query usuario_id=test-user-id
 * @pasos_ejecucion 1. Configurar mock de Supabase para simular fallo en la consulta select de notificaciones
 *                  2. Enviar solicitud de consulta con usuario_id válido
 *                  3. Invocar getNotifications con la solicitud simulada
 *                  4. Verificar el código de estado y el mensaje de error devueltos
 * @resultado_esperado El sistema responde con estado 500 y mensaje "Error al obtener notificaciones"
 */
test('Error al obtener notificaciones (líneas 235-254)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        notificaciones: {
          select: { data: null, error: { message: 'Notifications query failed' } },
        },
      },
    }),
  );

  const req = { query: { usuario_id: 'test-user-id' } };
  const res = mockRes();

  await getNotifications(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al obtener notificaciones' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Consulta exitosa de notificaciones del vecino
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino registrado tiene notificaciones pendientes asociadas a su cuenta
 * @datos_entrada Solicitud GET con query usuario_id=test-user-id
 * @pasos_ejecucion 1. Enviar solicitud de consulta de notificaciones con usuario_id válido
 *                  2. Invocar getNotifications con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar que la respuesta incluya arreglo notifications y contador count
 * @resultado_esperado El sistema responde con estado 200 y un objeto JSON con notifications (arreglo) y count (número)
 */
test('Caso de éxito al obtener notificaciones (líneas 248-251)', async () => {
  const req = { query: { usuario_id: 'test-user-id' } };
  const res = mockRes();

  await getNotifications(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ notifications: expect.any(Array), count: expect.any(Number) }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Manejo de error de persistencia al consultar publicaciones propias del vecino
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino solicita su historial de publicaciones pero el servicio de base de datos falla en la consulta
 * @datos_entrada Solicitud GET con params.usuario_id=test-user-id
 * @pasos_ejecucion 1. Configurar mock de Supabase para simular fallo en la consulta select de publicaciones del usuario
 *                  2. Enviar solicitud de consulta con usuario_id válido en la ruta
 *                  3. Invocar getUserPublications con la solicitud simulada
 *                  4. Verificar el código de estado y el mensaje de error devueltos
 * @resultado_esperado El sistema responde con estado 500 y mensaje "Error al obtener publicaciones del usuario"
 */
test('Error al obtener publicaciones del usuario (líneas 273-292)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        publicaciones: {
          select: { data: null, error: { message: 'User publications failed' } },
        },
      },
    }),
  );

  const req = { params: { usuario_id: 'test-user-id' } };
  const res = mockRes();

  await getUserPublications(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al obtener publicaciones del usuario' }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Consulta exitosa del historial de publicaciones propias del vecino
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino registrado tiene al menos una publicación activa en su historial
 * @datos_entrada Solicitud GET con params.usuario_id=test-user-id
 * @pasos_ejecucion 1. Enviar solicitud de consulta de publicaciones propias con usuario_id válido
 *                  2. Invocar getUserPublications con la solicitud simulada
 *                  3. Verificar el código de estado HTTP devuelto
 *                  4. Verificar que la respuesta incluya arreglo publications y contador count
 * @resultado_esperado El sistema responde con estado 200 y un objeto JSON con publications (arreglo) y count (número)
 */
test('Caso de éxito al obtener publicaciones del usuario (líneas 286-289)', async () => {
  const req = { params: { usuario_id: 'test-user-id' } };
  const res = mockRes();

  await getUserPublications(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ publications: expect.any(Array), count: expect.any(Number) }),
  );
});

/**
 * @requisito HU-8 Gestión de publicaciones
 * @description Manejo de error de persistencia al actualizar una publicación
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta modificar su publicación existente pero el servicio de base de datos falla en la operación update
 * @datos_entrada Solicitud PUT con id test-publication-id y cuerpo con titulo y estado inactiva
 * @pasos_ejecucion 1. Configurar mock de Supabase para simular fallo en la operación update de publicaciones
 *                  2. Enviar solicitud de actualización con identificador y datos modificados
 *                  3. Invocar updatePublication con la solicitud simulada
 *                  4. Verificar el código de estado y el mensaje de error devueltos
 * @resultado_esperado El sistema responde con estado 500 y mensaje "Error al actualizar publicación"
 */
test('Error al actualizar publicación (línea 173-177)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        publicaciones: {
          update: { data: null, error: { message: 'Update failed' } },
        },
      },
    }),
  );

  const req = {
    params: { id: 'test-publication-id' },
    body: { titulo: 'Nuevo titulo', estado: 'inactiva' },
  };
  const res = mockRes();

  await updatePublication(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al actualizar publicación' }),
  );
});
