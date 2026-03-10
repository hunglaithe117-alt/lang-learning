"""FastAPI application entry point."""

import os
from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None]:
    """Application lifecycle events."""
    # Create required directories
    os.makedirs(settings.upload_dir, exist_ok=True)
    os.makedirs(settings.chroma_persist_dir, exist_ok=True)
    print(f"🚀 LLM Service starting on " f"{settings.host}:{settings.port}")
    yield
    print("👋 LLM Service shutting down")


app = FastAPI(
    title="Lang Learning - LLM Service",
    description=(
        "AI-powered language learning service with "
        "LangChain agents, RAG, and document processing"
    ),
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(api_v1_router, prefix="/api/v1")
