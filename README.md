# VeciredBackend
Este repositorio está destinado a gestionar la lógica de negocio, la API y la base de datos del proyecto **Vecired**, operando de forma desacoplada del frontend (arquitectura cliente-servidor).

## 🛠️ Stack Tecnológico y Arquitectura Definida
El servidor estará construido sobre el ecosistema JavaScript para mantener coherencia con el cliente, apoyado en servicios en la nube para la persistencia de datos:
* **Entorno de Servidor:** Node.js
* **Framework Web / API REST:** Express.js
* **Base de Datos:** PostgreSQL (gestionada a través de Supabase)
* **Autenticación y Seguridad:** Supabase Auth (gestión segura de usuarios y sesiones)

## 🔒 Consideraciones de Seguridad
Durante el desarrollo se implementarán rutas protegidas y políticas de RLS (Row Level Security) en Supabase para garantizar que la información personal y las publicaciones de los vecinos estén resguardadas.
