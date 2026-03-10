# Lang Learning 📚

AI-powered language learning platform inspired by Google NotebookLM.

## Architecture

| Service | Tech Stack | Port | Path |
|---------|-----------|------|------|
| **Web** | React + Vite + Apollo Client | 5173 | `apps/web/` |
| **Server** | NestJS + Prisma + GraphQL | 3000 | `apps/server/` |
| **LLM** | Python + FastAPI + OpenAI | 8000 | `services/llm-service/` |
| **DB** | PostgreSQL 16 | 5432 | Docker |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your credentials

# 3. Start database
npm run docker:db

# 4. Run migrations (from server)
cd apps/server && npm run migrate:dev

# 5. Start all services (from root)
npm run dev
```

## Project Structure

```
├── apps/
│   ├── server/        # NestJS GraphQL API
│   └── web/           # React + Vite frontend
├── services/
│   └── llm-service/   # Python FastAPI LLM service
├── packages/
│   └── shared/        # Shared types & constants
├── turbo.json         # Turborepo config
├── docker-compose.yml # All services
└── package.json       # Workspace root
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all JS services |
| `npm run dev:server` | Start only NestJS server |
| `npm run dev:web` | Start only React web app |
| `npm run build` | Build all packages |
| `npm run lint` | Lint all packages |
| `npm run docker:db` | Start PostgreSQL |
| `npm run docker:up` | Start all via Docker |
