# Pruebas y calidad

## Tipos de prueba

| Tipo | Herramienta | Ubicación |
| :--- | :--- | :--- |
| Unitarias | Jest | `src/__tests__/*Controller.test.js` |
| Integración | Jest + Supertest | `integration.test.js`, `routes.test.js` |
| Lint | ESLint | `npm run lint` |

## Ejecución

```bash
npm test
npm run test:coverage
npm run lint
```

## Cobertura

Objetivo configurado: **≥ 85%** en branches, functions, lines y statements.

## CI/CD

Pipeline en `.github/workflows/ci-cd.yml`:

- Se ejecuta en cada Pull Request hacia `develop` o `main`
- Jobs: lint + pruebas automatizadas
- Despliegue continuo condicionado a merge en `main`

## E2E

Las pruebas end-to-end viven en el repositorio frontend (Playwright).
