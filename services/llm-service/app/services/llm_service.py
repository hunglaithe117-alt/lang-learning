"""LLM service using LangChain + LangGraph agent."""

from langchain_core.messages import HumanMessage

from app.agents.supervisor import agent_graph
from app.core.logging import logger
from app.schemas.chat import (
    ChatMessage,
    ChatRequest,
    ChatResponse,
)


class LLMService:
    """Service orchestrating the LangGraph agent."""

    async def chat(self, request: ChatRequest) -> ChatResponse:
        """Process a chat request through the agent.

        The agent will automatically decide whether to
        use tools (RAG search, vocab extraction, etc.)
        based on the user's message.

        Args:
            request: Chat request with messages and config.

        Returns:
            ChatResponse with the agent's reply.
        """
        # Build message history
        lc_messages = []
        for msg in request.messages:
            if msg.role == "user":
                lc_messages.append(HumanMessage(content=msg.content))

        logger.info(
            "Chat request | provider=%s | model=%s " "| document=%s | language=%s",
            request.provider,
            request.model,
            request.document_id,
            request.language,
        )

        # Invoke the agent graph
        result = await agent_graph.ainvoke(
            {
                "messages": lc_messages,
                "document_id": request.document_id,
                "language": request.language,
                "provider": request.provider,
                "model": request.model,
            }
        )

        # Extract final response
        final_message = result["messages"][-1]

        return ChatResponse(
            message=ChatMessage(
                role="assistant",
                content=final_message.content,
            ),
        )
