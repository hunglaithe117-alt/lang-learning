"""Document processing endpoints."""

import os
import uuid

from fastapi import APIRouter, HTTPException, UploadFile

from app.core.config import settings
from app.core.logging import logger
from app.schemas.document import (
    DocumentDeleteRequest,
    DocumentProcessResponse,
)
from app.services.document_processor import process_document
from app.services.vector_store import get_vector_store

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


@router.post("/upload", response_model=DocumentProcessResponse)
async def upload_and_process(
    file: UploadFile,
    language: str = "english",
) -> DocumentProcessResponse:
    """Upload a document and process it for learning.

    Saves the file, extracts text, chunks it,
    and indexes into ChromaDB vector store.

    Args:
        file: The uploaded file (PDF, DOCX, TXT).
        language: Document language ('english'/'chinese').

    Returns:
        Processing result with chunk count.
    """
    # Validate extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(f"Unsupported file type: {ext}. " f"Allowed: {ALLOWED_EXTENSIONS}"),
        )

    # Generate document ID
    document_id = str(uuid.uuid4())

    # Save file
    os.makedirs(settings.upload_dir, exist_ok=True)
    file_path = os.path.join(
        settings.upload_dir,
        f"{document_id}{ext}",
    )

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    logger.info(
        "Saved upload | id=%s | file=%s | size=%d",
        document_id,
        file.filename,
        len(content),
    )

    try:
        # Process: load → chunk → embed → store
        chunks = process_document(
            file_path=file_path,
            document_id=document_id,
            language=language,
        )

        store = get_vector_store()
        store.add_documents(chunks, document_id)

        return DocumentProcessResponse(
            document_id=document_id,
            chunks_count=len(chunks),
            message=(
                f"Document processed: {len(chunks)} chunks "
                f"indexed for '{file.filename}'"
            ),
        )
    except Exception as e:
        # Cleanup on failure
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {e}",
        ) from e


@router.delete("")
async def delete_document(
    request: DocumentDeleteRequest,
) -> dict:
    """Remove a document from the vector store."""
    store = get_vector_store()
    store.delete_document(request.document_id)
    return {"message": (f"Document {request.document_id} deleted")}
