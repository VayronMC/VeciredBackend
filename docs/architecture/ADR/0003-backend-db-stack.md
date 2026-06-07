# ADR 0003: Backend, base de datos y capa de persistencia

**Estado:** Aceptado  
**Fecha:** 2025  
**Relacionado con:** autenticación, tablón, relaciones entre entidades

---

## Contexto

El MVP de VeciRed modela entidades relacionadas: **usuarios (vecinos)**, **publicaciones**, **solicitudes de ayuda** y **reseñas**. Se requiere:

- Persistencia confiable con integridad referencial.
- Autenticación segura (registro, login, sesión).
- Un servidor donde implementar reglas de negocio que no deben ejecutarse en el cliente.
- Infraestructura viable con presupuesto cero para un proyecto universitario.

---

## Alcance del MVP

| Necesidad del dominio | Requisito técnico |
| :--- | :--- |
| Vecinos con perfil y foto | Tabla de usuarios/perfiles vinculada a Auth |
| Tablón de publicaciones | CRUD con estados (abierta, en progreso, finalizada) |
| Solicitudes “Lo tomé” | Relación usuario ↔ publicación con restricciones |
| Reseñas post-servicio | Registros ligados a interacciones completadas |
| Seguridad | Credenciales de BD fuera del frontend |

---

## Opciones consideradas

### Lenguaje y runtime del servidor

| Opción | Ventajas | Desventajas |
| :--- | :--- | :--- |
| **Node.js + JavaScript** | Mismo lenguaje que React; gran ecosistema npm | Un solo hilo; CPU-bound limitado (no crítico en MVP) |
| Python + FastAPI/Django | Sintaxis clara para APIs | Segundo stack para el equipo |
| Java + Spring Boot | Robusto en enterprise | Mayor tiempo de configuración |

### Framework HTTP

| Opción | Ventajas | Desventajas |
| :--- | :--- | :--- |
| **Express 5** | Minimalista, middleware, ampliamente documentado | Sin estructura impuesta; hay que organizar carpetas manualmente |
| NestJS | Arquitectura modular | Curva de aprendizaje y boilerplate extra |
| Fastify | Alto rendimiento | Menor familiaridad del equipo |

### Base de datos

| Opción | Ventajas | Desventajas |
| :--- | :--- | :--- |
| **PostgreSQL (vía Supabase)** | Relacional, ACID, auth integrado, hosting gratuito | Dependencia de proveedor externo |
| MongoDB Atlas | Esquema flexible | Relaciones vecino-publicación-reseña son naturalmente relacionales |
| MySQL local | Control total | El equipo administra backups, auth y hosting |
| Firebase Firestore | Tiempo real | Modelo de documentos menos natural para el ER del proyecto |

---

## Decisión

| Capa | Tecnología elegida |
| :--- | :--- |
| Runtime | **Node.js 20** |
| Framework API | **Express.js 5** |
| Base de datos | **PostgreSQL** (hosted en **Supabase**) |
| Autenticación | **Supabase Auth** (JWT), validado/orquestado desde Express |
| Cliente de BD | **`@supabase/supabase-js`** con **service role** solo en backend |

### Modelo de acceso a datos

- El frontend **no** se conecta a Supabase directamente en la arquitectura final del MVP.
- Express centraliza operaciones en `src/config/supabase.js` y controladores por dominio (`authController`, publicaciones, reseñas, etc.).
- Variables sensibles en `.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`), nunca en el repositorio.

---

## Justificación técnica

### PostgreSQL

- El dominio VeciRed es **relacional**: un vecino tiene muchas publicaciones; una publicación recibe solicitudes; las reseñas dependen de servicios concluidos.
- PostgreSQL garantiza integridad referencial, transacciones y consultas JOIN eficientes para listados del tablón y perfiles.

### Supabase

- Proporciona PostgreSQL administrado, panel SQL, Auth y API REST interna sin montar un servidor de BD propio.
- Reduce tiempo de infraestructura para cumplir plazos del semestre.
- Plan gratuito suficiente para demo, pruebas y producción académica.

### Node.js + Express

- Permite exponer endpoints REST alineados con ADR-002 en pocas semanas.
- Middleware (`cors`, `express.json`) cubre necesidades del MVP.
- Integración directa con Jest + Supertest para pruebas de controladores y rutas.
- Despliegue sencillo en Render con `npm start`.

---

## Consecuencias

### Positivas

- Lógica de negocio testeable sin levantar UI.
- Auth delegada a Supabase; Express valida tokens y aplica reglas adicionales (ej. intentos de login).
- Esquema SQL documentable y alineado con diagrama entidad-relación del curso.

### Negativas / deuda técnica

- Acoplamiento al proveedor Supabase (migración futura requiere export SQL y reconfigurar Auth).
- Service role en backend: si se filtra, compromete toda la BD → obligatorio usar env vars y `.gitignore`.
- Consultas complejas pueden requerir funciones SQL o RPC en Supabase en iteraciones posteriores.

---

## Impacto verificable en el proyecto

- Configuración: `src/config/supabase.js`
- Controladores: `src/controllers/`
- Pruebas con mock de Supabase en CI: `src/__tests__/`
- Despliegue: variables de entorno documentadas en `.env.example` y wiki de producción
