# Documentación API (Swagger)

## Acceso

| Entorno | URL |
| :--- | :--- |
| Local | http://localhost:3000/api-docs |
| Producción | https://tu-backend.onrender.com/api-docs |

## Endpoints implementados

### Autenticación (`/api/auth`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| POST | `/register` | Registrar vecino |
| POST | `/login` | Iniciar sesión |
| GET | `/profile` | Obtener perfil |
| PUT | `/profile` | Actualizar perfil |

### Publicaciones (`/api/publicaciones`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| GET | `/` | Listar publicaciones activas |
| POST | `/` | Crear publicación |
| GET | `/:id` | Detalle de publicación |
| PUT | `/:id` | Actualizar publicación |
| DELETE | `/:id` | Eliminar publicación |
| GET | `/notificaciones/list` | Notificaciones del usuario |
| GET | `/user/:usuario_id` | Publicaciones de un vecino |

### Solicitudes (`/api/solicitudes`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| POST | `/` | Crear solicitud de ayuda |
| GET | `/user/:usuario_id` | Solicitudes activas del vecino |

### Reseñas (`/api/resenas`)

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| POST | `/` | Crear reseña |
| GET | `/user/:id` | Reseñas recibidas |
| PUT | `/solicitud/:id` | Actualizar estado de solicitud |

## Especificación OpenAPI

El archivo fuente está en `src/docs/openapi.js` del repositorio.

## JSDoc en controladores

Cada función de los controladores incluye documentación JSDoc con parámetros y respuestas esperadas.
