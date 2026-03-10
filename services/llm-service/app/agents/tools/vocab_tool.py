"""Vocabulary extraction tool."""

from langchain_core.tools import tool


@tool
def extract_vocabulary(
    text: str,
    language: str = "english",
    count: int = 10,
) -> str:
    """Extract key vocabulary from a text passage.

    Use this when the user wants to learn new words from
    their document. Returns structured vocabulary with
    definitions, pronunciation, and examples.

    Args:
        text: The text to extract vocabulary from.
        language: 'english' or 'chinese'.
        count: Number of words to extract.

    Returns:
        Instruction for the LLM to format vocabulary.
    """
    if language == "chinese":
        return (
            f"From this text, extract the {count} most "
            f"important Chinese vocabulary items. "
            f"For each word provide:\n"
            f"- 汉字 (Chinese characters)\n"
            f"- Pinyin (with tone marks)\n"
            f"- Vietnamese meaning\n"
            f"- HSK level (if applicable)\n"
            f"- Example sentence (Chinese + Vietnamese)\n\n"
            f"Text:\n{text}"
        )
    else:
        return (
            f"From this text, extract the {count} most "
            f"important English vocabulary items. "
            f"For each word provide:\n"
            f"- Word/Phrase\n"
            f"- IPA pronunciation\n"
            f"- Part of speech\n"
            f"- Vietnamese meaning\n"
            f"- Example sentence (English + Vietnamese)\n\n"
            f"Text:\n{text}"
        )
