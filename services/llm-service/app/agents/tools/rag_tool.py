"""RAG search tool — retrieve relevant document chunks."""

from langchain_core.tools import tool

from app.services.vector_store import get_vector_store


@tool
def search_document(
    query: str,
    document_id: str | None = None,
) -> str:
    """Search uploaded documents for relevant content.

    Use this tool when the user asks questions about
    their uploaded learning materials, or when you need
    context from the document to generate exercises,
    vocabulary, or explanations.

    Args:
        query: The search query.
        document_id: Filter to a specific document.

    Returns:
        Relevant text passages from the document.
    """
    store = get_vector_store()
    results = store.search(
        query=query,
        document_id=document_id,
        k=5,
    )

    if not results:
        return "No relevant content found in documents."

    passages = []
    for i, doc in enumerate(results, 1):
        source = doc.metadata.get("source_file", "unknown")
        passages.append(f"[{i}] (Source: {source})\n{doc.page_content}")

    return "\n\n---\n\n".join(passages)
