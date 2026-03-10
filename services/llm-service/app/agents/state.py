"""LangGraph agent state definition."""

from typing import Annotated

from langgraph.graph.message import add_messages
from typing_extensions import TypedDict


class AgentState(TypedDict):
    """State passed through the LangGraph agent graph.

    Attributes:
        messages: Chat message history (auto-appended).
        document_id: Current document being studied.
        language: Target language (english/chinese).
        provider: User's chosen LLM provider.
        model: User's chosen model name.
    """

    messages: Annotated[list, add_messages]
    document_id: str | None
    language: str
    provider: str | None
    model: str | None
