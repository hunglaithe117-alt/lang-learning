"""Application configuration using pydantic-settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Service
    host: str = "0.0.0.0"
    port: int = 8000

    # Default LLM provider & model
    default_llm_provider: str = "openai"
    default_llm_model: str = "gpt-4o"

    # OpenAI
    openai_api_key: str = ""

    # Anthropic
    anthropic_api_key: str = ""

    # Google
    google_api_key: str = ""

    # Ollama (local)
    ollama_base_url: str = "http://localhost:11434"

    # Embeddings
    embedding_provider: str = "openai"
    embedding_model: str = "text-embedding-3-small"

    # ChromaDB
    chroma_persist_dir: str = "./chroma_data"
    chroma_collection_name: str = "documents"

    # Document upload
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 50

    # NestJS Server
    nestjs_server_url: str = "http://localhost:3000"


settings = Settings()
