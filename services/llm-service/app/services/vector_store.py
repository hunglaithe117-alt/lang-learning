"""ChromaDB vector store for document embeddings."""

import chromadb
from langchain_chroma import Chroma
from langchain_core.documents import Document

from app.core.config import settings
from app.core.logging import logger
from app.services.embedding_service import create_embeddings


class VectorStoreService:
    """Manages ChromaDB vector store operations."""

    def __init__(self) -> None:
        self._embeddings = create_embeddings()
        self._client = chromadb.PersistentClient(
            path=settings.chroma_persist_dir,
        )
        self._store: Chroma | None = None

    @property
    def store(self) -> Chroma:
        """Lazy-initialize the Chroma vector store."""
        if self._store is None:
            self._store = Chroma(
                client=self._client,
                collection_name=settings.chroma_collection_name,
                embedding_function=self._embeddings,
            )
        return self._store

    def add_documents(
        self,
        documents: list[Document],
        document_id: str,
    ) -> list[str]:
        """Add document chunks to vector store.

        Args:
            documents: LangChain Document objects.
            document_id: Source document ID for filtering.

        Returns:
            List of chunk IDs stored.
        """
        # Tag each chunk with the source document ID
        for doc in documents:
            doc.metadata["document_id"] = document_id

        ids = self.store.add_documents(documents)

        logger.info(
            "Added %d chunks to vector store | doc=%s",
            len(ids),
            document_id,
        )
        return ids

    def search(
        self,
        query: str,
        document_id: str | None = None,
        k: int = 5,
    ) -> list[Document]:
        """Search for relevant document chunks.

        Args:
            query: Search query text.
            document_id: Filter by document ID.
            k: Number of results.

        Returns:
            List of relevant Document chunks.
        """
        search_kwargs: dict = {"k": k}
        if document_id:
            search_kwargs["filter"] = {
                "document_id": document_id,
            }

        results = self.store.similarity_search(
            query,
            **search_kwargs,
        )

        logger.info(
            "Vector search | query='%s' | results=%d",
            query[:50],
            len(results),
        )
        return results

    def delete_document(self, document_id: str) -> None:
        """Remove all chunks for a document."""
        self.store.delete(
            where={"document_id": document_id},
        )
        logger.info(
            "Deleted chunks for document=%s",
            document_id,
        )


# Singleton
_vector_store: VectorStoreService | None = None


def get_vector_store() -> VectorStoreService:
    """Get or create the vector store singleton."""
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStoreService()
    return _vector_store
