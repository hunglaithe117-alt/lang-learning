"""Chat request/response schemas."""

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """A single chat message."""

    role: str = Field(description="Message role: 'user' or 'assistant'")
    content: str = Field(description="Message content")


class ChatRequest(BaseModel):
    """Chat request with user-configurable model."""

    messages: list[ChatMessage] = Field(description="Conversation messages")
    language: str = Field(
        default="english",
        description="Target language: 'english' or 'chinese'",
    )
    document_id: str | None = Field(
        default=None,
        description="Document ID for context-grounded answers",
    )
    provider: str | None = Field(
        default=None,
        description=(
            "LLM provider: openai, anthropic, google, "
            "ollama. Defaults to server config."
        ),
    )
    model: str | None = Field(
        default=None,
        description=(
            "Model name (e.g. gpt-4o, claude-3-5-sonnet). " "Defaults to server config."
        ),
    )


class ChatResponse(BaseModel):
    """Chat response from the agent."""

    message: ChatMessage = Field(description="Assistant's response")
