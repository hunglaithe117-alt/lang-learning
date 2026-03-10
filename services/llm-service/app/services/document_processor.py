"""Document processing: load, split, and prepare for embedding."""

import os
from pathlib import Path

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.core.config import settings
from app.core.logging import logger


# Language-specific chunking config
CHUNK_CONFIG = {
    "english": {
        "chunk_size": 1000,
        "chunk_overlap": 200,
        "separators": ["\n\n", "\n", ". ", " ", ""],
    },
    "chinese": {
        "chunk_size": 500,
        "chunk_overlap": 100,
        "separators": ["\n\n", "\n", "。", "！", "？", "，", " ", ""],
    },
}


def load_document(file_path: str) -> list[Document]:
    """Load a document file and return LangChain Documents.

    Supports: PDF, DOCX, TXT.

    Args:
        file_path: Absolute path to the file.

    Returns:
        List of LangChain Document objects.

    Raises:
        ValueError: If file type is not supported.
    """
    ext = Path(file_path).suffix.lower()
    logger.info("Loading document | path=%s | type=%s", file_path, ext)

    if ext == ".pdf":
        from langchain_community.document_loaders import (
            PyPDFLoader,
        )

        loader = PyPDFLoader(file_path)
    elif ext == ".docx":
        from langchain_community.document_loaders import (
            Docx2txtLoader,
        )

        loader = Docx2txtLoader(file_path)
    elif ext == ".txt":
        from langchain_community.document_loaders import (
            TextLoader,
        )

        loader = TextLoader(file_path, encoding="utf-8")
    else:
        raise ValueError(
            f"Unsupported file type: {ext}. " f"Supported: .pdf, .docx, .txt"
        )

    documents = loader.load()
    logger.info("Loaded %d pages/sections", len(documents))
    return documents


def split_documents(
    documents: list[Document],
    language: str = "english",
) -> list[Document]:
    """Split documents into chunks using language-aware strategy.

    Args:
        documents: LangChain Documents to split.
        language: 'english' or 'chinese'.

    Returns:
        List of chunked Documents.
    """
    config = CHUNK_CONFIG.get(language, CHUNK_CONFIG["english"])

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=config["chunk_size"],
        chunk_overlap=config["chunk_overlap"],
        separators=config["separators"],
        length_function=len,
    )

    chunks = splitter.split_documents(documents)

    logger.info(
        "Split into %d chunks | language=%s | " "chunk_size=%d",
        len(chunks),
        language,
        config["chunk_size"],
    )
    return chunks


def process_document(
    file_path: str,
    document_id: str,
    language: str = "english",
) -> list[Document]:
    """Full pipeline: load → split → tag with metadata.

    Args:
        file_path: Path to the uploaded file.
        document_id: Unique ID for this document.
        language: Document language.

    Returns:
        List of processed, chunked Documents.
    """
    # Load
    raw_docs = load_document(file_path)

    # Split
    chunks = split_documents(raw_docs, language=language)

    # Add metadata
    for i, chunk in enumerate(chunks):
        chunk.metadata.update(
            {
                "document_id": document_id,
                "chunk_index": i,
                "language": language,
                "source_file": os.path.basename(file_path),
            }
        )

    logger.info(
        "Processed document | id=%s | chunks=%d",
        document_id,
        len(chunks),
    )
    return chunks
