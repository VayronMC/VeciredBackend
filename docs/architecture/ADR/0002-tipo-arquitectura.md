# ADR 0002: Tipo de arquitectura del sistema

**Estado:** Aceptado  
**Fecha:** 2025  
**Relacionado con:** separación Frontend / Backend / Supabase

---

## Contexto

VeciRed conecta vecinos, gestiona autenticación y persiste publicaciones, solicitudes y reseñas. El sistema debe:

- Exponer reglas de negocio fuera del navegador (no confiar solo en validaciones del cliente).
- Permitir escalar o añadir clientes (web móvil, app nativa) sin reescribir la lógica central.
- Mantener dos repositorios independientes en GitHub (`VeciredFrontend` y `VeciredBackend`), coherente con el trabajo en equipo.

Era necesario definir **cómo se organizan y comunican** esas partes.

---

## Alcance del MVP

Arquitectura objetivo para las funcionalidades entregables:

```
[ Cliente web React ]  --HTTP/JSON-->  [ API Express ]  --SDK/SQL-->  [ Supabase PostgreSQL + Auth ]
```

| Capa | Responsabilidad en el MVP |
| :--- | :--- |
| Cliente (React) | UI, navegación, captura de datos, consumo de API |
| Servidor (Express) | Validación, autorización, orquestación de Supabase, reglas de negocio |
| Datos (Supabase) | Persistencia relacional y autenticación de usuarios |

---

## Opciones consideradas

| Estilo | Descripción | Evaluación para VeciRed |
| :--- | :--- | :--- |
| **Monolito full-stack** | Frontend y backend en un solo proyecto (ej. Next.js + API routes) | Menos alineado con repos separados y responsabilidades del curso |
| **Cliente-servidor + REST** | Cliente SPA + API stateless JSON | **Seleccionada:** clara separación y documentable con Swagger |
| **Cliente directo a Supabase** | React habla con Supabase sin capa intermedia | Descartada: expone lógica y claves; dificulta reglas de negocio custom |
| **GraphQL** | API con esquema flexible | Sobredimensionada; el MVP tiene endpoints acotados y estables |
| **Microservicios** | Varios servicios desplegables | Excesiva complejidad operativa para un MVP académico |

---

## Decisión

Se implementa una arquitectura **cliente-servidor desacoplada**, con comunicación mediante **API REST** sobre **HTTP** y payload **JSON**.

### Contrato de comunicación

| Aspecto | Criterio adoptado |
| :--- | :--- |
| Protocolo | HTTP/1.1 |
| Formato | JSON (`Content-Type: application/json`) |
| Autenticación | Token JWT de Supabase enviado en cabecera `Authorization` |
| Documentación | OpenAPI 3 en `/api-docs` |
| CORS | Habilitado en Express para permitir origen del frontend (local y Vercel) |

### Organización de repositorios

| Repositorio | Rol arquitectónico |
| :--- | :--- |
| `VeciredFrontend` | Cliente (presentación) |
| `VeciredBackend` | Servidor (aplicación + acceso a datos) |

---

## Justificación técnica

### Separación de responsabilidades

- El navegador **no** accede directamente a Supabase con service role; el backend concentra credenciales sensibles en variables de entorno (`SUPABASE_SERVICE_ROLE_KEY`).
- Reglas como “solo el autor puede cerrar su publicación” o “bloqueo tras intentos fallidos de login” se enforced en controladores Express, no solo en UI.

### API REST

- Recursos del dominio mapean a rutas explícitas: `/auth`, publicaciones, solicitudes, reseñas, perfil.
- Facilita pruebas automatizadas con **Supertest** y documentación para evaluadores mediante **Swagger UI**.
- Cualquier cliente futuro (app móvil) puede consumir los mismos endpoints.

### Escalabilidad académica y real

- Frontend desplegado en **Vercel** (estático + CDN).
- Backend desplegado en **Render** (proceso Node persistente).
- Base de datos administrada por **Supabase**, independiente del despliegue de la API.

---

## Consecuencias

### Positivas

- Diagramas C4 (contexto y contenedores) reflejan contenedores reales desplegables.
- CI/CD independiente por repositorio (lint, test, build).
- Fallos de UI y de API se diagnostican por capas.

### Negativas / deuda técnica

- Latencia adicional por salto cliente → API → Supabase frente a acceso directo a BD.
- Dos despliegues y dos pipelines que mantener sincronizados (`VITE_API_URL` debe apuntar al backend correcto).
- Sin versionado formal de API (`/v1/`) en el MVP; cambios breaking requieren coordinación manual frontend-backend.

---

## Impacto verificable en el proyecto

- Diagramas: `docs/architecture/diagrams/Diagrama de contexto.drawio.svg` y `Diagrama de contenedores - VeciRed.drawio.svg`
- Rutas REST: `src/routes/` en backend
- Consumo desde frontend: servicios que usan `import.meta.env.VITE_API_URL`
