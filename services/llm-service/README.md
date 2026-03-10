# LLM Service

AI-powered language learning service built with FastAPI, LangChain, and LangGraph.

## Setup (using uv)

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Run the service
uv run uvicorn app.main:app --reload --port 8000
```

## Development

```bash
# Install with dev dependencies
uv sync --extra dev

# Run tests
uv run pytest

# Lint
uv run ruff check .
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/api/v1/health
