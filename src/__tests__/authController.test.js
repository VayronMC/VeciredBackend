import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
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
 * @requisito HU-1 Registro de cuenta
 * @description Validación de longitud mínima de contraseña en el registro
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta crear una cuenta nueva en VeciRed con sus datos personales
 * @datos_entrada Solicitud de registro con contraseña de 5 caracteres (inferior al mínimo permitido)
 * @pasos_ejecucion 1. Enviar solicitud de registro con contraseña de 5 caracteres
 *                  2. Ejecutar la validación de reglas de negocio del controlador
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto al cliente
 * @resultado_esperado El sistema rechaza el registro con estado 400 e indica que la contraseña debe tener al menos 6 caracteres
 */
test('HU-1 - Validación de longitud mínima de contraseña (menor a 6 caracteres)', () => {
  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      correo_electronico: 'test@example.com',
      direccion: 'Dirección Test',
      contraseña: '12345',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'La contraseña debe tener al menos 6 caracteres',
  });
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Validación de contraseña con longitud mínima aceptable en el registro
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta registrarse con una contraseña que cumple la longitud mínima exigida
 * @datos_entrada Solicitud de registro con contraseña de exactamente 6 caracteres
 * @pasos_ejecucion 1. Enviar solicitud de registro con contraseña de 6 caracteres
 *                  2. Ejecutar la validación de longitud de contraseña
 *                  3. Verificar que no se devuelva error por longitud insuficiente
 * @resultado_esperado El sistema no rechaza el registro por motivo de longitud de contraseña
 */
test('HU-1 - Validación de longitud mínima de contraseña (6 caracteres - mínimo aceptable)', () => {
  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      correo_electronico: 'test@example.com',
      direccion: 'Dirección Test',
      contraseña: '123456',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  register(req, res);

  expect(res.json).not.toHaveBeenCalledWith({
    error: 'La contraseña debe tener al menos 6 caracteres',
  });
});

/**
 * @requisito HU-2 Autenticación
 * @description Validación de campos obligatorios en el inicio de sesión
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta iniciar sesión sin proporcionar su correo electrónico
 * @datos_entrada Solicitud de login con contraseña únicamente (sin correo_electronico)
 * @pasos_ejecucion 1. Enviar solicitud de login sin correo electrónico
 *                  2. Ejecutar la validación de campos obligatorios
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el acceso con estado 400 e indica que correo y contraseña son obligatorios
 */
test('HU-2 - Validación de credenciales en login (campos obligatorios)', () => {
  const req = {
    body: {
      contraseña: 'password123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Correo electrónico y contraseña son obligatorios',
  });
});

/**
 * @requisito HU-2 Autenticación
 * @description Validación de formato de correo electrónico en el inicio de sesión
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta iniciar sesión con un correo en formato no válido
 * @datos_entrada Solicitud de login con correo_electronico mal formado y contraseña válida
 * @pasos_ejecucion 1. Enviar solicitud de login con correo electrónico inválido
 *                  2. Ejecutar la validación de formato de correo
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el acceso con estado 400 e indica que el formato del correo no es válido
 */
test('HU-2 - Validación de formato de correo electrónico en login', () => {
  const req = {
    body: {
      correo_electronico: 'correo_invalido',
      contraseña: 'password123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'El formato del correo electrónico no es válido',
  });
});

/**
 * @requisito HU-2 Autenticación
 * @description Validación de identificador de usuario al consultar perfil
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino solicita ver su perfil sin indicar su identificador de usuario
 * @datos_entrada Solicitud de consulta de perfil sin el parámetro usuario_id
 * @pasos_ejecucion 1. Enviar solicitud de consulta de perfil sin usuario_id
 *                  2. Ejecutar la validación de parámetros obligatorios
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza la consulta con estado 400 e indica que usuario_id es obligatorio
 */
test('Validación de usuario_id obligatorio al obtener perfil', () => {
  const req = {
    query: {},
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  getProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'usuario_id es obligatorio',
  });
});

/**
 * @requisito HU-2 Autenticación
 * @description Validación de identificador de usuario al actualizar perfil
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta modificar su perfil sin indicar su identificador de usuario
 * @datos_entrada Solicitud de actualización con datos de perfil pero sin usuario_id
 * @pasos_ejecucion 1. Enviar solicitud de actualización de perfil sin usuario_id
 *                  2. Ejecutar la validación de parámetros obligatorios
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza la actualización con estado 400 e indica que usuario_id es obligatorio
 */
test('Validación de usuario_id obligatorio al actualizar perfil', () => {
  const req = {
    body: {
      nombre_completo: 'Usuario Test',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  updateProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'usuario_id es obligatorio',
  });
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Validación de formato de correo electrónico en el registro
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta registrarse con un correo electrónico mal formado
 * @datos_entrada Solicitud de registro con correo_electronico inválido y demás campos completos
 * @pasos_ejecucion 1. Enviar solicitud de registro con correo en formato incorrecto
 *                  2. Ejecutar la validación de formato de correo
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el registro con estado 400 e indica que el formato del correo no es válido
 */
test('Validación de formato de correo electrónico en registro', () => {
  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      correo_electronico: 'correo_invalido',
      direccion: 'Dirección Test',
      contraseña: 'password123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'El formato del correo electrónico no es válido',
  });
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Validación de campos obligatorios en el registro (nombre completo)
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta registrarse omitiendo su nombre completo
 * @datos_entrada Solicitud de registro sin el campo nombre_completo
 * @pasos_ejecucion 1. Enviar solicitud de registro incompleta (sin nombre)
 *                  2. Ejecutar la validación de campos obligatorios
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el registro con estado 400 e indica que todos los campos son obligatorios
 */
test('Validación de campos obligatorios en registro', () => {
  const req = {
    body: {
      correo_electronico: 'test@example.com',
      direccion: 'Dirección Test',
      contraseña: 'password123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Todos los campos son obligatorios',
  });
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Validación de dirección obligatoria en el registro
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta registrarse sin indicar su dirección en la comunidad
 * @datos_entrada Solicitud de registro sin el campo direccion
 * @pasos_ejecucion 1. Enviar solicitud de registro sin dirección
 *                  2. Ejecutar la validación de campos obligatorios
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el registro con estado 400 e indica que todos los campos son obligatorios
 */
test('Validación de dirección obligatoria en registro', () => {
  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      correo_electronico: 'test@example.com',
      contraseña: 'password123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Todos los campos son obligatorios',
  });
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Validación de correo electrónico obligatorio en el registro
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta registrarse sin proporcionar correo electrónico
 * @datos_entrada Solicitud de registro sin el campo correo_electronico
 * @pasos_ejecucion 1. Enviar solicitud de registro sin correo
 *                  2. Ejecutar la validación de campos obligatorios
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el registro con estado 400 e indica que todos los campos son obligatorios
 */
test('Validación de correo obligatorio en registro', () => {
  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      direccion: 'Dirección Test',
      contraseña: 'password123',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Todos los campos son obligatorios',
  });
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Validación de contraseña obligatoria en el registro
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta registrarse sin definir una contraseña de acceso
 * @datos_entrada Solicitud de registro sin el campo contraseña
 * @pasos_ejecucion 1. Enviar solicitud de registro sin contraseña
 *                  2. Ejecutar la validación de campos obligatorios
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el registro con estado 400 e indica que todos los campos son obligatorios
 */
test('Validación de contraseña obligatoria en registro', () => {
  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      correo_electronico: 'test@example.com',
      direccion: 'Dirección Test',
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    error: 'Todos los campos son obligatorios',
  });
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Registro exitoso de un nuevo vecino en la plataforma
 * @type {Unitaria - Caja Blanca}
 * @precondiciones El correo del vecino no está registrado previamente y los servicios de autenticación responden correctamente
 * @datos_entrada Solicitud de registro con nombre, correo, dirección y contraseña válidos
 * @pasos_ejecucion 1. Enviar solicitud de registro con datos válidos
 *                  2. Simular creación exitosa en autenticación y perfil
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje y datos del usuario creado
 * @resultado_esperado El sistema registra al vecino con estado 201 y devuelve confirmación con los datos del usuario
 */
test('Caso de éxito en registro', async () => {
  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      correo_electronico: 'test@example.com',
      contraseña: 'password123',
      direccion: 'Dirección Test',
      foto_perfil: null,
    },
  };

  const res = mockRes();

  await register(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Usuario registrado exitosamente' }),
  );
});

/**
 * @requisito HU-2 Autenticación
 * @description Inicio de sesión exitoso con credenciales válidas
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Existe un vecino registrado con credenciales válidas y perfil activo en la plataforma
 * @datos_entrada Solicitud de login con correo_electronico y contraseña correctos
 * @pasos_ejecucion 1. Enviar solicitud de login con credenciales válidas
 *                  2. Simular autenticación y consulta de perfil exitosas
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de acceso y datos de sesión
 * @resultado_esperado El sistema autentica al vecino con estado 200 y devuelve perfil y tokens de sesión
 */
test('Caso de éxito en login', async () => {
  const req = {
    body: {
      correo_electronico: 'test@example.com',
      contraseña: 'password123',
    },
  };

  const res = mockRes();

  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Inicio de sesión exitoso' }),
  );
});

/**
 * @requisito HU-2 Autenticación
 * @description Actualización exitosa del perfil de un vecino registrado
 * @type {Unitaria - Caja Blanca}
 * @precondiciones El vecino tiene una cuenta activa y su perfil existe en la base de datos
 * @datos_entrada Solicitud de actualización con usuario_id y datos de perfil modificados
 * @pasos_ejecucion 1. Enviar solicitud de actualización con usuario_id y campos de perfil
 *                  2. Simular actualización exitosa en base de datos
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje y perfil actualizado
 * @resultado_esperado El sistema actualiza el perfil con estado 200 y devuelve confirmación con los datos modificados
 */
test('Caso de éxito en actualización de perfil', async () => {
  const req = {
    body: {
      usuario_id: 'test-user-id',
      nombre_completo: 'Usuario Actualizado',
      correo_electronico: 'test@example.com',
      direccion: 'Dirección Actualizada',
      biografia: 'Biografía actualizada',
      foto_url: null,
    },
  };

  const res = mockRes();

  await updateProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Perfil actualizado exitosamente' }),
  );
});

/**
 * @requisito HU-2 Autenticación
 * @description Consulta exitosa del perfil de un vecino registrado
 * @type {Unitaria - Caja Blanca}
 * @precondiciones El vecino tiene una cuenta activa con perfil almacenado en la plataforma
 * @datos_entrada Solicitud de consulta con usuario_id válido en query
 * @pasos_ejecucion 1. Enviar solicitud de consulta de perfil con usuario_id válido
 *                  2. Simular consulta exitosa en base de datos
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar que se devuelva el objeto profile
 * @resultado_esperado El sistema retorna el perfil del vecino con estado 200
 */
test('Caso de éxito en obtención de perfil', async () => {
  const req = {
    query: { usuario_id: 'test-user-id' },
  };

  const res = mockRes();

  await getProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ profile: expect.anything() }));
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Error de autenticación al intentar registrar un correo ya existente
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta registrarse con un correo electrónico que ya está en uso
 * @datos_entrada Solicitud de registro válida cuyo correo genera conflicto en el servicio de autenticación
 * @pasos_ejecucion 1. Enviar solicitud de registro con datos válidos
 *                  2. Simular error de autenticación por usuario duplicado
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el registro con estado 400 e informa error al registrar en autenticación
 */
test('Error de Supabase Auth al registrar usuario (línea 42)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      auth: {
        createUser: { data: null, error: { message: 'User already registered' } },
      },
    }),
  );

  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      correo_electronico: 'test@example.com',
      contraseña: 'password123',
      direccion: 'Dirección Test',
    },
  };
  const res = mockRes();

  await register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al registrar usuario en autenticación' }),
  );
});

/**
 * @requisito HU-1 Registro de cuenta
 * @description Fallo al crear el perfil del vecino tras registro en autenticación
 * @type {Unitaria - Caja Blanca}
 * @precondiciones La autenticación del vecino se crea correctamente pero falla la persistencia del perfil
 * @datos_entrada Solicitud de registro con datos personales válidos
 * @pasos_ejecucion 1. Enviar solicitud de registro con datos válidos
 *                  2. Simular autenticación exitosa y error al insertar perfil
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema responde con estado 500 e indica error al crear el perfil de usuario
 */
test('Error al crear perfil de usuario (línea 61)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        perfiles: {
          insert: { data: null, error: { message: 'Profile creation error' } },
        },
      },
    }),
  );

  const req = {
    body: {
      nombre_completo: 'Usuario Test',
      correo_electronico: 'test@example.com',
      contraseña: 'password123',
      direccion: 'Dirección Test',
    },
  };
  const res = mockRes();

  await register(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al crear perfil de usuario' }),
  );
});

/**
 * @requisito HU-2 Autenticación
 * @description Inicio de sesión con correo no confirmado y confirmación automática exitosa
 * @type {Unitaria - Caja Blanca}
 * @precondiciones El vecino está registrado pero su correo aún no ha sido confirmado en la plataforma
 * @datos_entrada Solicitud de login con credenciales válidas de un usuario con email pendiente de confirmación
 * @pasos_ejecucion 1. Enviar solicitud de login con credenciales válidas
 *                  2. Simular error "Email not confirmed" en primer intento de autenticación
 *                  3. Simular confirmación automática del correo y reintento exitoso de login
 *                  4. Verificar el código de estado HTTP y la respuesta de sesión
 * @resultado_esperado El sistema confirma el correo, completa el acceso con estado 200 y devuelve sesión activa
 */
test('Login con email no confirmado y reintento exitoso (líneas 112-165)', async () => {
  let signInCalls = 0;
  const mockSupabase = createMockSupabase({
    auth: {
      signInWithPassword: () => {
        signInCalls += 1;
        if (signInCalls === 1) {
          return Promise.resolve({ data: null, error: { message: 'Email not confirmed' } });
        }
        return Promise.resolve({
          data: {
            user: { id: 'test-user-id', email: 'test@example.com' },
            session: { access_token: 'tok', refresh_token: 'ref', expires_at: 9999 },
          },
          error: null,
        });
      },
      listUsers: {
        data: { users: [{ id: 'test-user-id', email: 'test@example.com' }] },
        error: null,
      },
      updateUserById: { error: null },
    },
  });
  createSupabaseClient.mockReturnValue(mockSupabase);

  const req = { body: { correo_electronico: 'test@example.com', contraseña: 'password123' } };
  const res = mockRes();

  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledTimes(2);
});

/**
 * @requisito HU-2 Autenticación
 * @description Rechazo de acceso por credenciales incorrectas
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Un vecino intenta acceder con contraseña incorrecta para una cuenta existente
 * @datos_entrada Solicitud de login con correo válido y contraseña errónea
 * @pasos_ejecucion 1. Enviar solicitud de login con credenciales inválidas
 *                  2. Simular rechazo del servicio de autenticación
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema rechaza el acceso con estado 400 e indica credenciales incorrectas
 */
test('Login con credenciales incorrectas (líneas 144-148)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      auth: {
        signInWithPassword: { data: null, error: { message: 'Invalid login credentials' } },
      },
    }),
  );

  const req = { body: { correo_electronico: 'test@example.com', contraseña: 'wrong' } };
  const res = mockRes();

  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Credenciales incorrectas' }),
  );
});

/**
 * @requisito HU-2 Autenticación
 * @description Fallo al recuperar perfil tras autenticación exitosa
 * @type {Unitaria - Caja Blanca}
 * @precondiciones El vecino se autentica correctamente pero su perfil no está disponible en la base de datos
 * @datos_entrada Solicitud de login con credenciales válidas
 * @pasos_ejecucion 1. Enviar solicitud de login con credenciales válidas
 *                  2. Simular autenticación exitosa y error al consultar perfil
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema responde con estado 500 e indica error al obtener el perfil de usuario
 */
test('Login con error al obtener perfil (líneas 158-162)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        perfiles: {
          select: { data: null, error: { message: 'Profile not found' } },
        },
      },
    }),
  );

  const req = { body: { correo_electronico: 'test@example.com', contraseña: 'password123' } };
  const res = mockRes();

  await login(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al obtener perfil de usuario' }),
  );
});

/**
 * @requisito HU-2 Autenticación
 * @description Consulta de perfil de un vecino inexistente en la plataforma
 * @type {Unitaria - Caja Blanca}
 * @precondiciones Se solicita el perfil de un usuario_id que no existe en la base de datos
 * @datos_entrada Solicitud de consulta con usuario_id inexistente
 * @pasos_ejecucion 1. Enviar solicitud de consulta de perfil con identificador inválido
 *                  2. Simular ausencia del perfil en base de datos
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema responde con estado 404 e indica que el perfil no fue encontrado
 */
test('Error al obtener perfil no encontrado (líneas 201-214)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        perfiles: {
          select: { data: null, error: { message: 'Profile not found' } },
        },
      },
    }),
  );

  const req = { query: { usuario_id: 'id-inexistente' } };
  const res = mockRes();

  await getProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Perfil no encontrado' }),
  );
});

/**
 * @requisito HU-2 Autenticación
 * @description Fallo al persistir cambios en el perfil del vecino
 * @type {Unitaria - Caja Blanca}
 * @precondiciones El vecino intenta actualizar su perfil pero la operación falla en la base de datos
 * @datos_entrada Solicitud de actualización con usuario_id y campos de perfil modificados
 * @pasos_ejecucion 1. Enviar solicitud de actualización de perfil con datos válidos
 *                  2. Simular error en la operación de actualización en base de datos
 *                  3. Verificar el código de estado HTTP de la respuesta
 *                  4. Verificar el mensaje de error devuelto
 * @resultado_esperado El sistema responde con estado 500 e indica error al actualizar el perfil
 */
test('Error al actualizar perfil (líneas 252-256)', async () => {
  createSupabaseClient.mockReturnValue(
    createMockSupabase({
      tables: {
        perfiles: {
          update: { data: null, error: { message: 'Update error' } },
        },
      },
    }),
  );

  const req = {
    body: {
      usuario_id: 'test-user-id',
      nombre_completo: 'Nuevo Nombre',
      biografia: '',
      foto_url: null,
    },
  };
  const res = mockRes();

  await updateProfile(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ error: 'Error al actualizar perfil' }),
  );
});
