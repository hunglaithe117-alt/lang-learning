"""Health check endpoint."""

from fastapi import APIRouter

from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Check if the service is running."""
    return HealthResponse(status="healthy", service="llm-service", version="0.1.0")
