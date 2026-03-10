"""Document processing schemas."""

from pydantic import BaseModel, Field


class DocumentProcessRequest(BaseModel):
    """Request to process an uploaded document."""

    document_id: str = Field(description="Unique ID for this document")
    language: str = Field(
        default="english",
        description="Document language: 'english' or 'chinese'",
    )


class DocumentProcessResponse(BaseModel):
    """Response after document processing."""

    document_id: str
    chunks_count: int = Field(description="Number of chunks indexed")
    message: str


class DocumentDeleteRequest(BaseModel):
    """Request to delete a document from vector store."""

    document_id: str


class AvailableProvidersResponse(BaseModel):
    """List of available LLM providers."""

    providers: list[str]
    default_provider: str
    default_model: str
