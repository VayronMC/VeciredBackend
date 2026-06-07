# ADR 0001: Lenguaje de programación y frameworks frontend

**Estado:** Aceptado  
**Fecha:** 2025  
**Relacionado con:** MVP VeciRed (login, registro, tablón, perfil, reseñas)

---

## Contexto

VeciRed es una aplicación web orientada a vecinos que necesitan publicar favores, solicitar ayuda y calificar experiencias. El equipo partió de un diseño en Figma con pantallas modulares (formularios, tarjetas del tablón, perfil de usuario) y un plazo acotado de un semestre.

Era necesario elegir un stack frontend que:

- Permita construir interfaces reactivas sin recargar la página completa.
- Facilite reutilizar componentes visuales entre login, registro, home y perfil.
- Sea compatible con despliegue estático en la nube (Vercel).
- Tenga curva de aprendizaje razonable para el equipo.

---

## Alcance del MVP

Esta decisión cubre exclusivamente la **capa de presentación** del cliente web:

| Funcionalidad MVP | Implicación técnica |
| :--- | :--- |
| Login y registro | Formularios controlados, validación en cliente, manejo de errores HTTP |
| Tablón comunitario | Listado dinámico, filtros, tarjetas reutilizables |
| Publicaciones y solicitudes | Formularios, estados de carga, navegación entre vistas |
| Perfil y reseñas | Edición de datos, visualización de historial |

---

## Opciones consideradas

| Opción | Ventajas | Desventajas para VeciRed |
| :--- | :--- | :--- |
| **HTML + CSS + JS vanilla** | Sin dependencias; control total | Mucho código repetido para el tablón y los formularios; difícil mantener consistencia con Figma |
| **React + Vite + Tailwind** | Componentes reutilizables; ecosistema amplio; estilos rápidos | Requiere aprender JSX y convenciones de React |
| **Vue + Vite** | Curva suave; buen rendimiento | Menor alineación con conocimientos previos del equipo |
| **Angular** | Estructura enterprise | Mayor complejidad inicial; sobredimensionado para el MVP |
| **Next.js** | SSR y routing integrado | No se requiere SEO avanzado ni renderizado en servidor para el MVP comunitario cerrado |

---

## Decisión

Se adopta el siguiente stack en el repositorio **VeciredFrontend**:

| Elemento | Elección |
| :--- | :--- |
| Lenguaje | **JavaScript (ES modules)** |
| Biblioteca UI | **React 19** |
| Bundler / dev server | **Vite 8** |
| Estilos | **Tailwind CSS 4** |
| Iconografía | **Lucide React** |

TypeScript se descartó en esta iteración para reducir fricción en entrega y pruebas E2E del MVP.

---

## Justificación técnica

### JavaScript

- Es el lenguaje nativo del navegador y del ecosistema Node del backend, lo que unifica criterios en ambos repositorios.
- El MVP no requiere tipado estático obligatorio; la validación crítica ocurre en el backend (Express + Supabase).

### React

- El tablón se modela como **componentes independientes** (`Home`, tarjetas de publicación, modales), alineados con el diseño por bloques de Figma.
- El estado de sesión (usuario autenticado, vista activa) se centraliza en `App.jsx` sin recargar la página.
- Amplia documentación y soporte para integración con APIs REST mediante `fetch`.

### Vite

- Arranque del servidor de desarrollo en segundos, importante para iterar diseño y flujos de login/registro.
- Genera un build estático (`dist/`) compatible con **Vercel**, plataforma elegida para producción.
- Configuración mínima para proyectos React comparado con Create React App.

### Tailwind CSS

- Permite aplicar la paleta verde (`emerald`) y espaciados del diseño sin crear hojas CSS extensas por pantalla.
- Utilidades responsivas para que login y tablón funcionen en móvil y escritorio.

---

## Consecuencias

### Positivas

- Desarrollo paralelo: frontend consume contratos REST mientras el backend evoluciona.
- Build liviano desplegable como sitio estático.
- Componentes reutilizables reducen duplicación entre login y registro.

### Negativas / deuda técnica

- Sin TypeScript, algunos errores de integración con la API solo aparecen en runtime o en pruebas E2E.
- Tailwind puede generar clases largas en JSX si no se extraen componentes UI comunes.
- React implica gestionar estado manualmente (sin Redux) en flujos más complejos futuros.

---

## Impacto verificable en el proyecto

- Repositorio: `VeciredFrontend`
- Entrada: `src/main.jsx` → `App.jsx`
- Comunicación con backend: variable `VITE_API_URL` apuntando a Express en local o Render en producción.
- Pruebas: Playwright E2E sobre flujos de login y publicación.
