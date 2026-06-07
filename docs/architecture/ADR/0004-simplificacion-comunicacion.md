# ADR 0004: Alcance funcional del MVP — comunicación y estados

**Estado:** Aceptado  
**Fecha:** 2025  
**Relacionado con:** reducción de complejidad técnica del producto mínimo viable

---

## Contexto

En el diseño inicial se evaluó permitir que los vecinos negocien servicios **dentro** de la plataforma (chat en tiempo real, notificaciones push, mensajería interna). Para un MVP con plazo de un semestre y equipo reducido, era necesario **delimitar qué capacidades entran y cuáles se posponen**, documentando el impacto arquitectónico de esa decisión.

Esta ADR no elige un framework; define **qué problema resuelve el MVP** y qué infraestructura **no** se construye en esta iteración.

---

## Alcance del MVP (funcionalidades incluidas)

| Flujo | Comportamiento |
| :--- | :--- |
| Publicar necesidad | Vecino crea publicación visible en el tablón |
| Solicitar ayuda | Otro vecino marca interés (“Lo tomé”) |
| Coordinación | Datos de contacto acordados **fuera** de la app (teléfono, dirección en perfil/publicación) |
| Cierre | Botones de flujo actualizan estado en BD (en progreso → finalizado) |
| Reputación | Reseña al terminar el servicio |

---

## Opciones consideradas

| Enfoque | Implicación técnica | Decisión |
| :--- | :--- | :--- |
| **Chat en tiempo real (WebSockets / Supabase Realtime)** | Servidor persistente, rooms, presencia, moderación | **Descartado** en MVP |
| **Mensajería asíncrona interna** | Tabla de mensajes, polling o SSE, notificaciones | **Pospuesto** |
| **Contacto externo + estados en UI** | Actualizaciones REST sobre publicaciones/solicitudes | **Adoptado** |
| **Solo tablón sin estados** | Sin trazabilidad del servicio | Insuficiente para reseñas |

---

## Decisión

1. **No** se implementa chat interno ni mensajería en tiempo real en el MVP.
2. La coordinación entre vecinos ocurre por **canales externos** (información ya capturada en registro/perfil/publicación).
3. El **estado del servicio** se gestiona en la interfaz mediante acciones explícitas que disparan peticiones REST al backend, que persiste el cambio en PostgreSQL.

### Estados típicos de una publicación (MVP)

```
[ Abierta ] → [ En progreso ] → [ Finalizada ] → [ Reseña opcional ]
```

Cada transición es una operación HTTP validada en Express, no un evento en tiempo real.

---

## Justificación técnica

### Reducción de complejidad

- WebSockets o Supabase Realtime implican conexiones persistentes, reconexión, escalado en Render free tier y pruebas más difíciles.
- El MVP demuestra arquitectura cliente-servidor, persistencia relacional y despliegue; el chat no era requisito mínimo del curso.

### Alineación con REST existente

- “Lo tomé” y “Finalizar” son **mutaciones de recursos** (`PATCH`/`PUT`), coherentes con ADR-002.
- Las reseñas dependen de un estado terminal verificable en BD, evitando calificaciones sobre servicios no concluidos.

### Experiencia de usuario suficiente para validar la idea

- VeciRed busca conectar vecinos del mismo entorno; el contacto directo (teléfono) es habitual en comunidades de confianza.
- El tablón centraliza la demanda; los estados dan trazabilidad sin duplicar WhatsApp dentro de la app.

---

## Consecuencias

### Positivas

- Menor superficie de ataque (sin moderación de chat).
- Pruebas E2E con Playwright cubren flujos completos sin simular sockets.
- Backend stateless simple de escalar horizontalmente en teoría.

### Negativas / limitaciones conscientes

- No hay historial de conversación dentro de la plataforma.
- Dependencia de que el usuario comparta datos de contacto adecuados.
- En una v2 sería necesaria ADR nueva para mensajería, notificaciones o Realtime.

---

## Impacto verificable en el proyecto

- Frontend: botones de acción en publicaciones; sin componentes de chat.
- Backend: endpoints de cambio de estado y reseñas, no rutas `/messages`.
- Esta decisión delimita el **perímetro del MVP** frente a funcionalidades futuras documentadas como deuda/evolución.
