"""API v1 router aggregator."""

from fastapi import APIRouter

from app.api.v1.endpoints.health import router as health_router
from app.api.v1.endpoints.chat import router as chat_router
from app.api.v1.endpoints.documents import (
    router as documents_router,
)
from app.api.v1.endpoints.providers import (
    router as providers_router,
)

api_v1_router = APIRouter()

api_v1_router.include_router(health_router, prefix="/health", tags=["Health"])
api_v1_router.include_router(chat_router, prefix="/chat", tags=["Chat"])
api_v1_router.include_router(documents_router, prefix="/documents", tags=["Documents"])
api_v1_router.include_router(providers_router, prefix="/providers", tags=["Providers"])
