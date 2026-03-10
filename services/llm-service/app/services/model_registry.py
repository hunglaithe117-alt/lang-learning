"""Model registry — user-configurable LLM providers.

Supports: OpenAI, Anthropic, Google Gemini, Ollama (local).
Users can switch providers at runtime via API.
"""

from langchain_core.language_models import BaseChatModel

from app.core.config import settings
from app.core.logging import logger


# Provider → module mapping (lazy import to avoid dep errors)
_PROVIDER_REGISTRY: dict[str, type] = {}


def _register_providers() -> None:
    """Register available providers based on installed packages."""
    global _PROVIDER_REGISTRY

    try:
        from langchain_openai import ChatOpenAI

        _PROVIDER_REGISTRY["openai"] = ChatOpenAI
    except ImportError:
        pass

    try:
        from langchain_anthropic import ChatAnthropic

        _PROVIDER_REGISTRY["anthropic"] = ChatAnthropic
    except ImportError:
        pass

    try:
        from langchain_google_genai import ChatGoogleGenerativeAI

        _PROVIDER_REGISTRY["google"] = ChatGoogleGenerativeAI
    except ImportError:
        pass

    try:
        from langchain_community.chat_models import ChatOllama

        _PROVIDER_REGISTRY["ollama"] = ChatOllama
    except ImportError:
        pass


_register_providers()


def get_available_providers() -> list[str]:
    """Return list of available LLM providers."""
    return list(_PROVIDER_REGISTRY.keys())


def create_chat_model(
    provider: str | None = None,
    model: str | None = None,
    temperature: float = 0.7,
    **kwargs,
) -> BaseChatModel:
    """Create a LangChain chat model for the given provider.

    Args:
        provider: LLM provider name (openai, anthropic,
                  google, ollama). Defaults to config.
        model: Model name. Defaults to config.
        temperature: Sampling temperature.
        **kwargs: Extra kwargs passed to the model constructor.

    Returns:
        A LangChain BaseChatModel instance.

    Raises:
        ValueError: If provider is not available.
    """
    provider = provider or settings.default_llm_provider
    model = model or settings.default_llm_model

    if provider not in _PROVIDER_REGISTRY:
        available = get_available_providers()
        raise ValueError(
            f"Provider '{provider}' not available. " f"Installed: {available}"
        )

    model_class = _PROVIDER_REGISTRY[provider]
    logger.info(
        "Creating chat model | provider=%s | model=%s",
        provider,
        model,
    )

    # Provider-specific config
    if provider == "openai":
        return model_class(
            model=model,
            temperature=temperature,
            api_key=settings.openai_api_key,
            **kwargs,
        )
    elif provider == "anthropic":
        return model_class(
            model=model,
            temperature=temperature,
            api_key=settings.anthropic_api_key,
            **kwargs,
        )
    elif provider == "google":
        return model_class(
            model=model,
            temperature=temperature,
            google_api_key=settings.google_api_key,
            **kwargs,
        )
    elif provider == "ollama":
        return model_class(
            model=model,
            temperature=temperature,
            base_url=settings.ollama_base_url,
            **kwargs,
        )

    # Fallback
    return model_class(
        model=model,
        temperature=temperature,
        **kwargs,
    )
