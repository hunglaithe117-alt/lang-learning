"""Embedding service using LangChain."""

from langchain_core.embeddings import Embeddings

from app.core.config import settings
from app.core.logging import logger


def create_embeddings(
    provider: str | None = None,
    model: str | None = None,
) -> Embeddings:
    """Create a LangChain embeddings instance.

    Args:
        provider: Embedding provider (openai, ollama).
        model: Embedding model name.

    Returns:
        A LangChain Embeddings instance.
    """
    provider = provider or settings.embedding_provider
    model = model or settings.embedding_model

    logger.info(
        "Creating embeddings | provider=%s | model=%s",
        provider,
        model,
    )

    if provider == "openai":
        from langchain_openai import OpenAIEmbeddings

        return OpenAIEmbeddings(
            model=model,
            api_key=settings.openai_api_key,
        )
    elif provider == "ollama":
        from langchain_community.embeddings import (
            OllamaEmbeddings,
        )

        return OllamaEmbeddings(
            model=model,
            base_url=settings.ollama_base_url,
        )

    raise ValueError(
        f"Embedding provider '{provider}' not supported. " f"Use 'openai' or 'ollama'."
    )
