# ADR 0002: Tipo de Arquitectura

* **Estado:** ✅ Aceptado

## Contexto
Es necesario definir cómo se comunicarán las partes del sistema para asegurar escalabilidad y separación de responsabilidades.

## Decisión
Se implementará una arquitectura **Cliente-Servidor** comunicada a través de una **API REST** con formato JSON.

## Justificación
* **Separación de preocupaciones:** El Frontend (Cliente) se ejecuta ligero en el navegador, mientras que el Backend (Servidor) maneja reglas de negocio y seguridad.
* **Escalabilidad:** Esta estructura garantiza que en el futuro se pueda conectar una aplicación móvil nativa sin tener que reescribir el backend.
