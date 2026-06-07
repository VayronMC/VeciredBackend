# VeciRed Backend

API REST de **VeciRed**, plataforma comunitaria que conecta vecinos para compartir servicios, favores y préstamos. Este repositorio contiene la lógica de negocio, autenticación y acceso a datos, desacoplada del cliente web (arquitectura cliente-servidor).

Repositorio relacionado: [VeciredFrontend](https://github.com/VayronMC/VeciredFrontend)

---

## Descripción del proyecto

VeciRed permite a los vecinos de una comunidad:

- Registrarse e iniciar sesión de forma segura
- Publicar necesidades de ayuda en un tablón comunitario
- Solicitar apoyo sobre publicaciones de otros vecinos
- Gestionar su perfil y publicaciones
- Calificar la experiencia mediante reseñas

El backend expone endpoints REST consumidos por el frontend React y persiste la información en **PostgreSQL** mediante **Supabase**.

---

## Tecnologías utilizadas

| Capa | Tecnología |
| :--- | :--- |
| Runtime | Node.js 20 |
| Framework API | Express.js 5 |
| Base de datos | PostgreSQL (Supabase) |
| Autenticación | Supabase Auth |
| Documentación API | Swagger UI (OpenAPI 3) |
| Pruebas | Jest, Supertest |
| CI/CD | GitHub Actions |
| Contenedores | Docker, Docker Compose |

---

## Arquitectura general

VeciRed sigue una arquitectura **cliente-servidor** en tres capas:

```
[ Frontend React ]  --HTTP/JSON-->  [ Backend Express ]  --SQL-->  [ Supabase PostgreSQL ]
```

### Diagramas C4

| Nivel | Diagrama |
| :--- | :--- |
| Contexto | [Diagrama de contexto](./docs/architecture/diagrams/Diagrama%20de%20contexto.drawio.svg) |
| Contenedores | [Diagrama de contenedores](./docs/architecture/diagrams/Diagrama%20de%20contenedores%20-%20VeciRed.drawio.svg) |

### Estructura del repositorio

```
src/
├── config/          # Configuración de Supabase
├── controllers/     # Lógica de negocio por dominio
├── routes/          # Definición de rutas REST
├── docs/            # Especificación OpenAPI
└── __tests__/       # Pruebas unitarias e integración
```

### Registro de decisiones (ADRs)

| ID | Decisión | Enlace |
| :--- | :--- | :--- |
| 001 | Stack Frontend | [ADR-001](./docs/architecture/ADR/0001-frontend-stack.md) |
| 002 | Arquitectura Cliente-Servidor | [ADR-002](./docs/architecture/ADR/0002-tipo-arquitectura.md) |
| 003 | Stack Backend + Supabase | [ADR-003](./docs/architecture/ADR/0003-backend-db-stack.md) |
| 004 | Simplificación MVP | [ADR-004](./docs/architecture/ADR/0004-simplificacion-comunicacion.md) |

---

## Guía de instalación

### Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior
- [npm](https://www.npmjs.com/) 10+
- Cuenta y proyecto en [Supabase](https://supabase.com/)
- (Opcional) [Docker](https://www.docker.com/) para ejecución con contenedores

### Pasos

1. Clonar el repositorio:

```bash
git clone https://github.com/VayronMC/VeciredBackend.git
cd VeciredBackend
```

2. Instalar dependencias:

```bash
npm ci
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase.

4. Verificar instalación con pruebas:

```bash
npm test
```

---

## Ejecución local

### Modo desarrollo

```bash
npm start
```

La API estará disponible en `http://localhost:3000`.

### Con Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

---

## Documentación de API (Swagger)

Con el servidor en ejecución, abre:

**http://localhost:3000/api-docs**

Incluye todos los endpoints implementados agrupados por módulo:

| Prefijo | Descripción |
| :--- | :--- |
| `/api/auth` | Registro, login y perfil |
| `/api/publicaciones` | Tablón comunitario y notificaciones |
| `/api/solicitudes` | Solicitudes de ayuda |
| `/api/resenas` | Reseñas y cierre de solicitudes |

La especificación OpenAPI se encuentra en `src/docs/openapi.js`.

---

## Documentación del código (JSDoc)

Las funciones clave de los controladores están documentadas con **JSDoc** (`@param`, `@returns`, descripción). Archivos documentados:

- `src/controllers/authController.js`
- `src/controllers/publicController.js`
- `src/controllers/solicitudesController.js`
- `src/controllers/resenaController.js`
- `src/config/supabase.js`

---

## Variables de entorno

| Variable | Descripción |
| :--- | :--- |
| `PORT` | Puerto del servidor (local: `3000`) |
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service role (solo backend, nunca en frontend) |
| `NODE_ENV` | `development` o `production` |

Consulta `.env.example` para la plantilla completa.

---

## Pruebas

```bash
npm test              # Ejecutar todas las pruebas
npm run test:coverage # Reporte de cobertura
npm run lint          # Análisis estático
```

---

## CI/CD

El pipeline de GitHub Actions (`.github/workflows/ci-cd.yml`) ejecuta en cada Pull Request:

- Lint del código
- Pruebas automatizadas

El despliegue continuo a producción se activa al integrar cambios en la rama `main`.

---

## Despliegue en producción (Render)

1. Crear un **Web Service** en [Render](https://render.com) conectado a este repositorio
2. **Branch:** `main`
3. **Build command:** `npm ci`
4. **Start command:** `npm start`
5. Configurar las variables de entorno del `.env.example`
6. Documentación Swagger disponible en `https://tu-backend.onrender.com/api-docs`

---

## Wiki del repositorio

Información ampliada del proyecto en la [Wiki de GitHub](https://github.com/VayronMC/VeciredBackend/wiki).

Las páginas fuente están en `docs/wiki/` para facilitar su publicación. Consulta [docs/wiki/README.md](./docs/wiki/README.md) para instrucciones de activación.

---

## Seguridad

- Las credenciales de Supabase se gestionan mediante variables de entorno
- El archivo `.env` está excluido del control de versiones
- Se recomienda aplicar políticas RLS en Supabase para producción

---

## Licencia

ISC
