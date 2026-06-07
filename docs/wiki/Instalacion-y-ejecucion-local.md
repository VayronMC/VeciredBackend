# Instalación y ejecución local

## Requisitos

- Node.js 20+
- npm 10+
- Proyecto Supabase configurado
- (Opcional) Docker Desktop

## Instalación

```bash
git clone https://github.com/VayronMC/VeciredBackend.git
cd VeciredBackend
npm ci
cp .env.example .env
```

Completa `.env` con:

| Variable | Origen |
| :--- | :--- |
| `SUPABASE_URL` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (service_role) |
| `PORT` | `3000` |
| `NODE_ENV` | `development` |

## Ejecución sin Docker

```bash
npm start
```

Verifica: `http://localhost:3000` debe responder con un JSON de estado.

## Ejecución con Docker Compose

```bash
docker compose up --build
```

## Verificar instalación

```bash
npm test
npm run lint
```

## Documentación interactiva

Con el servidor activo: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
