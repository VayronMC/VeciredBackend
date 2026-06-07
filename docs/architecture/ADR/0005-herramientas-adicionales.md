# ADR 0005: Herramientas adicionales de calidad, documentación y despliegue

**Estado:** Aceptado  
**Fecha:** 2025-2026  
**Relacionado con:** entrega de ingeniería de software (CI/CD, pruebas, docs, producción)

---

## Contexto

Más allá del stack de aplicación (React, Express, Supabase), el curso exige demostrar **buenas prácticas de ingeniería**: integración continua, pruebas, documentación técnica y despliegue en producción. Era necesario seleccionar herramientas complementarias que no añadan complejidad desproporcionada al MVP.

---

## Alcance del MVP

Estas herramientas soportan el ciclo de vida del software, no funcionalidades visibles al vecino final:

| Área | Objetivo en VeciRed |
| :--- | :--- |
| Calidad de código | Detectar errores antes de merge |
| Pruebas | Evitar regresiones en API y flujos críticos |
| Documentación | Explicar API a evaluadores y al equipo |
| Despliegue | App accesible por URL pública |
| Contenedores | Reproducibilidad del entorno (aprendizaje) |

---

## Opciones consideradas

| Categoría | Alternativas evaluadas | Elección MVP |
| :--- | :--- | :--- |
| CI/CD | GitHub Actions, GitLab CI, Jenkins | **GitHub Actions** (repos ya en GitHub) |
| Lint | ESLint | **ESLint** en frontend y backend |
| Tests backend | Jest, Mocha, Vitest | **Jest + Supertest** |
| Tests frontend | Cypress, Playwright | **Playwright** (E2E login/publicación) |
| Docs API | Postman collections, Swagger | **Swagger UI + OpenAPI 3** en `/api-docs` |
| Docs código | Comentarios sueltos, JSDoc | **JSDoc** en controladores |
| Deploy backend | Railway, Fly.io, Render, VPS | **Render** (Web Service Node) |
| Deploy frontend | Netlify, Vercel, GitHub Pages | **Vercel** (optimizado para Vite) |
| Contenedores | Docker, Podman | **Docker + Docker Compose** (local / evidencia) |

---

## Decisión

### Integración y entrega continua

- **GitHub Actions** (`.github/workflows/ci-cd.yml`) en ambos repositorios.
- En PR/push a `develop` y `main`: lint + tests (backend) / lint + build (frontend).
- Job de deploy declarado para rama `main` (integración con Render/Vercel).

### Calidad y pruebas

| Repo | Herramienta | Qué valida |
| :--- | :--- | :--- |
| Backend | ESLint + Jest | Estilo, controladores, rutas (mock de Supabase en CI) |
| Frontend | ESLint + `vite build` | Estilo y compilación de producción |
| Frontend | Playwright | Flujos E2E con capturas en `e2e-evidence/` |

### Documentación

- **README** completo por repositorio (instalación, arquitectura, despliegue).
- **Swagger** (`src/docs/openapi.js`) montado en Express.
- **JSDoc** en controladores y configuración de Supabase.
- **Wiki GitHub** (contenido en `docs/wiki/` para copiar a la wiki del repo).
- **Diagramas C4** en `docs/architecture/diagrams/`.
- **ADRs** en `docs/architecture/ADR/` (este registro).

### Despliegue en producción

| Componente | Plataforma | Motivo |
| :--- | :--- | :--- |
| Backend Express | **Render** | Soporte Node nativo, variables de entorno, plan free |
| Frontend estático | **Vercel** | Integración con GitHub, builds Vite, CDN global |
| Base de datos | **Supabase** | Ya elegida en ADR-003; no se redeploya con la API |

### Docker

- `Dockerfile` y `docker-compose.yml` documentados para **ejecución local reproducible**.
- Despliegue académico en Render usa **Node directo** (`npm ci` / `npm start`), no imagen Docker en producción, para simplificar la primera entrega en la nube.

---

## Justificación técnica

- **GitHub Actions:** cero costo, integración nativa con los repos del equipo, evidencia visible en pestaña Actions para la rúbita.
- **Swagger:** permite a evaluadores probar endpoints sin leer todo el código; alinea documentación con implementación si se mantiene `openapi.js`.
- **Playwright:** valida el sistema completo (UI + API real o staging), complementando pruebas unitarias del backend.
- **Render + Vercel:** separación acorde con ADR-002; configuración mínima para estudiantes sin administrar servidores Linux.
- **Docker:** evidencia de contenedorización aprendida en el curso sin hacer obligatorio el deploy containerizado en free tier.

---

## Consecuencias

### Positivas

- Pipeline repetible en cada PR.
- Documentación multipunto (README, Wiki, Swagger, ADR, diagramas).
- URLs de producción demostrables en la entrega final.

### Negativas / deuda técnica

- Múltiples fuentes de documentación que deben mantenerse sincronizadas manualmente.
- Playwright E2E puede ser inestable en CI si no hay mock de backend dedicado.
- Plan free de Render introduce cold starts que afectan demos en vivo.

---

## Impacto verificable en el proyecto

- Workflows: `.github/workflows/ci-cd.yml` (backend y frontend)
- Swagger en producción: `https://<backend>/api-docs`
- Frontend en producción: URL Vercel con `VITE_API_URL` configurada
- Evidencias E2E: `VeciredFrontend/e2e-evidence/`
