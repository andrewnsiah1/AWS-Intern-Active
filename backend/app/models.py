"""Pydantic models for request/response schemas."""

from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    """Incoming chat message from the user."""

    message: str
    session_id: Optional[str] = None
    player_state: Optional["PlayerState"] = None
    conversation_history: Optional[list] = None


class PlayerState(BaseModel):
    """Current game state for the player, stored client-side."""

    xp: int = 0
    level: int = 1
    level_name: str = "Apprentice"
    quests_completed: list[str] = []
    quests_active: list[str] = []
    achievements: list[str] = []
    topics_explored: list[str] = []
    conversation_count: int = 0


class Source(BaseModel):
    """A citation source from the Knowledge Base."""

    title: str
    url: Optional[str] = None
    snippet: str


class XPEvent(BaseModel):
    """An XP gain event to show the player."""

    reason: str
    amount: int


class QuestUpdate(BaseModel):
    """A quest progress update."""

    quest_id: str
    quest_name: str
    progress: str  # "started", "progressed", "completed"
    description: str


class ChatResponse(BaseModel):
    """Response back to the frontend."""

    message: str
    sources: list[Source] = []
    player_state: PlayerState
    xp_events: list[XPEvent] = []
    quest_updates: list[QuestUpdate] = []
    new_achievements: list[str] = []


# Required for forward reference resolution
ChatRequest.model_rebuild()
