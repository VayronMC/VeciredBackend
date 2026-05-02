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

## 🗺️ Arquitectura del Sistema (C4 Model)

### Nivel 1: Contexto
![Diagrama de Contexto](./docs/architecture/diagrams/Diagrama%20de%20contexto.drawio.svg)

### Nivel 2: Contenedores
![Diagrama de Contenedores](./docs/architecture/diagrams/Diagrama%20de%20contenedores%20-%20VeciRed.drawio.svg)

### 🧠 Registro de Decisiones (ADRs)
Mantenemos un registro de por qué elegimos ciertas tecnologías o caminos de diseño:

| ID | Decisión Técnica | Estado |
| :--- | :--- | :--- |
| **001** | [Stack Frontend (React + Vite + Tailwind)](./docs/architecture/ADR/0001-frontend-stack.m) | ✅ Aceptado |
| **002** | [Arquitectura Cliente-Servidor (API REST)](./docs/architecture/ADR/0002-tipo-arquitectura.md) | ✅ Aceptado |
| **003** | [Stack Backend (Node + Express + Supabase)](./docs/architecture/ADR/0003-backend-db-stack.md) | ✅ Aceptado |
| **004** | [Simplificación de Comunicación MVP](./docs/architecture/ADR/0004-simplificacion-comunicacion.md) | ✅ Aceptado |
