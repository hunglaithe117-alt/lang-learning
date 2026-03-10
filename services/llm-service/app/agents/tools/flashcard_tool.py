"""Flashcard generation tool."""

from langchain_core.tools import tool


@tool
def generate_flashcards(
    text: str,
    language: str = "english",
    count: int = 10,
) -> str:
    """Generate flashcards from document content.

    Use this when the user wants to create flashcards
    for spaced repetition study.

    Args:
        text: Source text for flashcard content.
        language: 'english' or 'chinese'.
        count: Number of flashcards.

    Returns:
        Instruction for the LLM to format flashcards.
    """
    if language == "chinese":
        return (
            f"Create {count} flashcards from this text. "
            f"Each flashcard should have:\n"
            f"- **Front**: Chinese word/phrase (汉字)\n"
            f"- **Back**: Pinyin + Vietnamese meaning "
            f"+ example sentence\n\n"
            f"Format as JSON array with fields: "
            f"front, back, pinyin, meaning_vi, example\n\n"
            f"Text:\n{text}"
        )
    else:
        return (
            f"Create {count} flashcards from this text. "
            f"Each flashcard should have:\n"
            f"- **Front**: English word/phrase\n"
            f"- **Back**: IPA pronunciation + Vietnamese "
            f"meaning + example sentence\n\n"
            f"Format as JSON array with fields: "
            f"front, back, ipa, meaning_vi, example\n\n"
            f"Text:\n{text}"
        )
