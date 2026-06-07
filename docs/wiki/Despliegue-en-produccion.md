# Despliegue en producción

## Plataforma recomendada: Render

### Pasos

1. Crear cuenta en [render.com](https://render.com)
2. **New → Web Service** → conectar `VeciredBackend`
3. Configuración:
   - **Branch:** `main`
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
4. Variables de entorno (Environment):

| Variable | Valor |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | URL de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |
| `PORT` | (Render lo asigna automáticamente) |

5. Desplegar y copiar la URL pública

### Post-despliegue

- Verificar: `GET /` responde JSON de estado
- Swagger: `GET /api-docs`
- Configurar `VITE_API_URL` en el frontend con esta URL

## CI/CD

Al hacer merge a `main`, GitHub Actions valida lint y pruebas. Render redeploya automáticamente si está conectado al repositorio.

## Docker en producción

Los archivos `Dockerfile` y `docker-compose.yml` están orientados al aprendizaje y ejecución local. El despliegue académico usa Render directamente con Node.js.
