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

Consulta la carpeta `docs/architecture/ADR/` para el registro de decisiones del equipo.
