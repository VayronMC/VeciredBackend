/**
 * Especificación OpenAPI 3.0 de la API REST de VeciRed.
 * @module docs/openapi
 */

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'VeciRed API',
    version: '1.0.0',
    description:
      'API REST del backend de VeciRed. Gestiona autenticación, publicaciones, solicitudes de ayuda y reseñas vecinales.',
    contact: {
      name: 'VeciRed - Proyecto de Software',
    },
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Entorno local' },
    { url: 'https://vecired-backend.onrender.com', description: 'Producción (Render)' },
  ],
  tags: [
    { name: 'General', description: 'Estado del servicio' },
    { name: 'Autenticación', description: 'Registro, login y perfil de vecinos' },
    { name: 'Publicaciones', description: 'Tablón comunitario de ayuda' },
    { name: 'Solicitudes', description: 'Solicitudes de ayuda sobre publicaciones' },
    { name: 'Reseñas', description: 'Calificaciones entre vecinos' },
  ],
  paths: {
    '/': {
      get: {
        tags: ['General'],
        summary: 'Verificar estado de la API',
        responses: {
          200: {
            description: 'API operativa',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'VeciRed Backend API funcionando correctamente' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Autenticación'],
        summary: 'Registrar un nuevo vecino',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Usuario registrado exitosamente' },
          400: { description: 'Datos inválidos' },
          500: { description: 'Error interno' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Autenticación'],
        summary: 'Iniciar sesión',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Inicio de sesión exitoso con tokens de sesión' },
          400: { description: 'Credenciales incorrectas o datos inválidos' },
          500: { description: 'Error interno' },
        },
      },
    },
    '/api/auth/profile': {
      get: {
        tags: ['Autenticación'],
        summary: 'Obtener perfil de un vecino',
        parameters: [
          {
            name: 'usuario_id',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: { description: 'Perfil encontrado' },
          400: { description: 'usuario_id obligatorio' },
          404: { description: 'Perfil no encontrado' },
        },
      },
      put: {
        tags: ['Autenticación'],
        summary: 'Actualizar perfil de un vecino',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProfileRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Perfil actualizado' },
          400: { description: 'Datos inválidos' },
          500: { description: 'Error al actualizar' },
        },
      },
    },
    '/api/publicaciones': {
      get: {
        tags: ['Publicaciones'],
        summary: 'Listar publicaciones activas',
        parameters: [
          { name: 'categoria', in: 'query', schema: { type: 'string', enum: ['Servicios', 'Favores', 'Préstamos'] } },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Búsqueda en título y descripción' },
        ],
        responses: {
          200: { description: 'Listado de publicaciones' },
          500: { description: 'Error al consultar' },
        },
      },
      post: {
        tags: ['Publicaciones'],
        summary: 'Crear una publicación',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PublicationRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Publicación creada' },
          400: { description: 'Datos inválidos' },
          500: { description: 'Error al crear' },
        },
      },
    },
    '/api/publicaciones/notificaciones/list': {
      get: {
        tags: ['Publicaciones'],
        summary: 'Obtener notificaciones de un vecino',
        parameters: [
          {
            name: 'usuario_id',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: { description: 'Notificaciones del usuario' },
          400: { description: 'usuario_id obligatorio' },
        },
      },
    },
    '/api/publicaciones/user/{usuario_id}': {
      get: {
        tags: ['Publicaciones'],
        summary: 'Obtener publicaciones de un vecino',
        parameters: [
          {
            name: 'usuario_id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: { description: 'Publicaciones del usuario' },
          400: { description: 'usuario_id obligatorio' },
        },
      },
    },
    '/api/publicaciones/{id}': {
      get: {
        tags: ['Publicaciones'],
        summary: 'Obtener una publicación por ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Publicación encontrada' },
          404: { description: 'No encontrada' },
        },
      },
      put: {
        tags: ['Publicaciones'],
        summary: 'Actualizar una publicación',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdatePublicationRequest' },
            },
          },
        },
        responses: {
          200: { description: 'Publicación actualizada' },
          500: { description: 'Error al actualizar' },
        },
      },
      delete: {
        tags: ['Publicaciones'],
        summary: 'Eliminar una publicación',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Publicación eliminada' },
          500: { description: 'Error al eliminar' },
        },
      },
    },
    '/api/solicitudes': {
      post: {
        tags: ['Solicitudes'],
        summary: 'Crear solicitud de ayuda sobre una publicación',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SolicitudRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Solicitud creada' },
          409: { description: 'Solicitud duplicada' },
          400: { description: 'Datos inválidos' },
        },
      },
    },
    '/api/solicitudes/user/{usuario_id}': {
      get: {
        tags: ['Solicitudes'],
        summary: 'Obtener solicitudes activas de un vecino',
        parameters: [
          {
            name: 'usuario_id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          200: { description: 'Solicitudes activas del usuario' },
          400: { description: 'usuario_id obligatorio' },
        },
      },
    },
    '/api/resenas': {
      post: {
        tags: ['Reseñas'],
        summary: 'Crear una reseña',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResenaRequest' },
            },
          },
        },
        responses: {
          201: { description: 'Reseña creada' },
          400: { description: 'Datos inválidos' },
          500: { description: 'Error al crear' },
        },
      },
    },
    '/api/resenas/user/{id}': {
      get: {
        tags: ['Reseñas'],
        summary: 'Obtener reseñas recibidas por un vecino',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          200: { description: 'Reseñas del evaluado' },
          400: { description: 'ID obligatorio' },
        },
      },
    },
    '/api/resenas/solicitud/{id}': {
      put: {
        tags: ['Reseñas'],
        summary: 'Actualizar estado de una solicitud',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['estado'],
                properties: {
                  estado: { type: 'string', enum: ['pendiente', 'completada'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Estado actualizado' },
          400: { description: 'Estado inválido' },
        },
      },
    },
  },
  components: {
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['nombre_completo', 'correo_electronico', 'direccion', 'contraseña'],
        properties: {
          nombre_completo: { type: 'string', example: 'Ana García' },
          correo_electronico: { type: 'string', format: 'email' },
          direccion: { type: 'string', example: 'Colonia Centro 123' },
          contraseña: { type: 'string', minLength: 6 },
          foto_perfil: { type: 'string', nullable: true },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['correo_electronico', 'contraseña'],
        properties: {
          correo_electronico: { type: 'string', format: 'email' },
          contraseña: { type: 'string' },
        },
      },
      UpdateProfileRequest: {
        type: 'object',
        required: ['usuario_id'],
        properties: {
          usuario_id: { type: 'string', format: 'uuid' },
          nombre_completo: { type: 'string' },
          correo_electronico: { type: 'string' },
          direccion: { type: 'string' },
          biografia: { type: 'string' },
          foto_url: { type: 'string', nullable: true },
        },
      },
      PublicationRequest: {
        type: 'object',
        required: ['descripcion', 'categoria', 'usuario_id'],
        properties: {
          titulo: { type: 'string' },
          descripcion: { type: 'string' },
          categoria: { type: 'string', enum: ['Servicios', 'Favores', 'Préstamos'] },
          usuario_id: { type: 'string', format: 'uuid' },
          telefono: { type: 'string' },
          foto_url: { type: 'string', nullable: true },
        },
      },
      UpdatePublicationRequest: {
        type: 'object',
        properties: {
          titulo: { type: 'string' },
          descripcion: { type: 'string' },
          categoria: { type: 'string', enum: ['Servicios', 'Favores', 'Préstamos'] },
          telefono: { type: 'string' },
          foto_url: { type: 'string', nullable: true },
          estado: { type: 'string', example: 'activa' },
        },
      },
      SolicitudRequest: {
        type: 'object',
        required: ['usuario_id', 'publicacion_id'],
        properties: {
          usuario_id: { type: 'string', format: 'uuid' },
          publicacion_id: { type: 'string', format: 'uuid' },
        },
      },
      ResenaRequest: {
        type: 'object',
        required: ['usuario_id', 'evaluado_id', 'publicacion_id', 'solicitud_id', 'calificacion'],
        properties: {
          usuario_id: { type: 'string', format: 'uuid' },
          evaluado_id: { type: 'string', format: 'uuid' },
          publicacion_id: { type: 'string', format: 'uuid' },
          solicitud_id: { type: 'string', format: 'uuid' },
          calificacion: { type: 'integer', minimum: 1, maximum: 5 },
          comentario: { type: 'string' },
        },
      },
    },
  },
};
