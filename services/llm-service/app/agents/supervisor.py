"""LangGraph supervisor agent for language learning.

Orchestrates tools (RAG, vocab, exercises, flashcards)
based on user intent, with user-configurable LLM provider.
"""

from langchain_core.messages import SystemMessage
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode

from app.agents.state import AgentState
from app.agents.tools.exercise_tool import generate_exercises
from app.agents.tools.flashcard_tool import generate_flashcards
from app.agents.tools.rag_tool import search_document
from app.agents.tools.vocab_tool import extract_vocabulary
from app.services.model_registry import create_chat_model
from app.utils.prompt_templates import build_system_prompt

# All available tools
TOOLS = [
    search_document,
    extract_vocabulary,
    generate_exercises,
    generate_flashcards,
]


def _create_agent_node(state: AgentState) -> dict:
    """Main agent reasoning node.

    Receives state, calls LLM with tools, returns
    updated messages.
    """
    llm = create_chat_model(
        provider=state.get("provider"),
        model=state.get("model"),
    )
    llm_with_tools = llm.bind_tools(TOOLS)

    system_prompt = build_system_prompt(
        target_language=state.get("language", "english"),
    )
    system_msg = SystemMessage(content=system_prompt)

    messages = [system_msg, *state["messages"]]
    response = llm_with_tools.invoke(messages)

    return {"messages": [response]}


def _should_continue(state: AgentState) -> str:
    """Decide: call tools or finish."""
    last_message = state["messages"][-1]

    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END


def create_agent_graph() -> StateGraph:
    """Build the LangGraph agent workflow.

    Graph:
        agent → (has tool calls?) → tools → agent
                 (no tool calls?) → END

    Returns:
        Compiled LangGraph StateGraph.
    """
    graph = StateGraph(AgentState)

    # Nodes
    graph.add_node("agent", _create_agent_node)
    graph.add_node("tools", ToolNode(TOOLS))

    # Edges
    graph.set_entry_point("agent")
    graph.add_conditional_edges(
        "agent",
        _should_continue,
        {"tools": "tools", END: END},
    )
    graph.add_edge("tools", "agent")

    return graph.compile()


# Pre-compiled agent graph (singleton)
agent_graph = create_agent_graph()
