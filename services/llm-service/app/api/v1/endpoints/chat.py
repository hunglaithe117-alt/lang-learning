"""Chat endpoint — interacts with LangGraph agent."""

from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import LLMService

router = APIRouter()
llm_service = LLMService()


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Chat with the language learning agent.

    The agent automatically uses tools (RAG search,
    vocabulary extraction, exercise generation, etc.)
    based on the user's message intent.

    The user can optionally specify:
    - provider/model to control which LLM is used
    - document_id to ground answers in a specific doc
    - language to set the target learning language
    """
    try:
        return await llm_service.chat(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
