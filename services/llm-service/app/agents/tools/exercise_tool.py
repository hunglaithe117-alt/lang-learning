"""Exercise generation tool."""

from langchain_core.tools import tool


@tool
def generate_exercises(
    text: str,
    language: str = "english",
    exercise_type: str = "mixed",
    count: int = 5,
) -> str:
    """Generate learning exercises from document content.

    Use this when the user wants to practice. Creates
    exercises based on the document content.

    Args:
        text: Source text to create exercises from.
        language: 'english' or 'chinese'.
        exercise_type: Type of exercises to generate.
            Options: 'multiple_choice', 'fill_in_blank',
            'translation', 'matching', 'mixed'.
        count: Number of exercises.

    Returns:
        Instruction for the LLM to format exercises.
    """
    type_instructions = {
        "multiple_choice": (
            "multiple choice questions with 4 options "
            "(A, B, C, D) and mark the correct answer"
        ),
        "fill_in_blank": (
            "fill-in-the-blank exercises where key words "
            "are removed and students must supply them"
        ),
        "translation": (
            "translation exercises between "
            f"{'Chinese' if language == 'chinese' else 'English'}"
            " and Vietnamese"
        ),
        "matching": ("matching exercises pairing words/phrases " "with their meanings"),
        "mixed": (
            "a mix of multiple choice, fill-in-blank, " "and translation exercises"
        ),
    }

    instruction = type_instructions.get(
        exercise_type,
        type_instructions["mixed"],
    )

    return (
        f"Based on this text, create {count} "
        f"{instruction}.\n\n"
        f"For each exercise provide:\n"
        f"- Clear question/prompt\n"
        f"- Answer options (if applicable)\n"
        f"- Correct answer\n"
        f"- Brief explanation in Vietnamese\n\n"
        f"Text:\n{text}"
    )
