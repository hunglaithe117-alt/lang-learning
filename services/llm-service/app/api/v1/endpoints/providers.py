"""Providers endpoint — list available LLM providers."""

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.document import AvailableProvidersResponse
from app.services.model_registry import get_available_providers

router = APIRouter()


@router.get("", response_model=AvailableProvidersResponse)
async def list_providers() -> AvailableProvidersResponse:
    """List all available LLM providers.

    Returns installed providers so the frontend
    can render them as options for the user.
    """
    return AvailableProvidersResponse(
        providers=get_available_providers(),
        default_provider=settings.default_llm_provider,
        default_model=settings.default_llm_model,
    )
