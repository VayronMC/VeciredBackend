# ADR 0003: Backend, Base de Datos y Herramientas Adicionales

* **Estado:** ✅ Aceptado

## Contexto
El sistema requiere una persistencia de datos robusta, manejo de usuarios y una capa de servidor para lógica personalizada.

## Decisión
Se utilizará **Supabase** (PostgreSQL y Auth) como Backend-as-a-Service, complementado con un servidor **Node.js con Express**.

## Justificación
* **PostgreSQL:** Motor relacional robusto ideal para el modelo Entidad-Relación entre vecinos, publicaciones y reseñas.
* **Supabase:** Reduce drásticamente el tiempo de configuración de infraestructura (Autenticación y DB lista para usar).
* **Express:** Framework minimalista que permite levantar la API REST de forma rápida y estructurada.
