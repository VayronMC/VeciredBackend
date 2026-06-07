# Arquitectura del sistema

## Patrón arquitectónico

VeciRed implementa **arquitectura cliente-servidor** con API REST:

```
Frontend (React)  →  Backend (Express)  →  Supabase (PostgreSQL + Auth)
```

## Capas del backend

| Capa | Ubicación | Responsabilidad |
| :--- | :--- | :--- |
| Rutas | `src/routes/` | Endpoints HTTP y enrutamiento |
| Controladores | `src/controllers/` | Validación y lógica de negocio |
| Configuración | `src/config/` | Cliente Supabase |
| Documentación | `src/docs/` | Especificación OpenAPI |

## Módulos funcionales

| Módulo | Rutas | Historias de usuario |
| :--- | :--- | :--- |
| Autenticación | `/api/auth` | Registro, login, perfil |
| Publicaciones | `/api/publicaciones` | Tablón comunitario |
| Solicitudes | `/api/solicitudes` | Tomar una publicación |
| Reseñas | `/api/resenas` | Calificar vecinos |

## Diagramas C4

Los diagramas oficiales están en el repositorio:

- [Diagrama de contexto](https://github.com/VayronMC/VeciredBackend/blob/develop/docs/architecture/diagrams/Diagrama%20de%20contexto.drawio.svg)
- [Diagrama de contenedores](https://github.com/VayronMC/VeciredBackend/blob/develop/docs/architecture/diagrams/Diagrama%20de%20contenedores%20-%20VeciRed.drawio.svg)

## Decisiones técnicas (ADRs)

Registro en `docs/architecture/ADR/`. Cada ADR documenta contexto, alternativas, decisión, consecuencias e impacto en el MVP.

| ADR | Tema de la rúbrica |
| :--- | :--- |
| [0001](https://github.com/VayronMC/VeciredBackend/blob/develop/docs/architecture/ADR/0001-frontend-stack.md) | Lenguaje y frameworks frontend |
| [0002](https://github.com/VayronMC/VeciredBackend/blob/develop/docs/architecture/ADR/0002-tipo-arquitectura.md) | Arquitectura cliente-servidor y API REST |
| [0003](https://github.com/VayronMC/VeciredBackend/blob/develop/docs/architecture/ADR/0003-backend-db-stack.md) | Backend, base de datos (PostgreSQL/Supabase) |
| [0004](https://github.com/VayronMC/VeciredBackend/blob/develop/docs/architecture/ADR/0004-simplificacion-comunicacion.md) | Alcance funcional del MVP |
| [0005](https://github.com/VayronMC/VeciredBackend/blob/develop/docs/architecture/ADR/0005-herramientas-adicionales.md) | Herramientas adicionales (CI/CD, pruebas, deploy) |
