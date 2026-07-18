"""FastAPI application - main entry point for the AWS Wizard Game backend."""

import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from .models import ChatRequest, ChatResponse, PlayerState
from .wizard import ask_wizard
from .game import process_game_turn, QUESTS, ACHIEVEMENTS, LEVELS
from .rate_limit import rate_limiter

app = FastAPI(
    title="AWS Wizard Game API",
    description="Backend API for the AWS Wizard interactive learning game",
    version="1.0.0",
)

# CORS - allow GitHub Pages and local dev
allowed_origins = os.environ.get(
    "ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "alive", "wizard": "Cloudius the Eternal awaits"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, raw_request: Request):
    """
    Main chat endpoint. Processes a message through the wizard AI
    and updates game state.
    """
    # Rate limit: 20 requests/min per IP
    rate_limiter.check(raw_request)

    # Initialize player state if not provided
    player_state = request.player_state or PlayerState()

    # Process game mechanics (XP, quests, achievements)
    player_state, xp_events, quest_updates, new_achievements = process_game_turn(
        player_state, request.message
    )

    # Get wizard response from Bedrock
    wizard_reply, sources = await ask_wizard(
        message=request.message,
        player_state=player_state,
    )

    return ChatResponse(
        message=wizard_reply,
        sources=sources,
        player_state=player_state,
        xp_events=xp_events,
        quest_updates=quest_updates,
        new_achievements=new_achievements,
    )


@app.get("/quests")
async def get_quests():
    """Get all available quests."""
    return {"quests": QUESTS}


@app.get("/achievements")
async def get_achievements():
    """Get all available achievements (without condition functions)."""
    return {
        "achievements": {
            k: {"name": v["name"], "description": v["description"]}
            for k, v in ACHIEVEMENTS.items()
        }
    }


@app.get("/levels")
async def get_levels():
    """Get level thresholds."""
    return {"levels": [{"threshold": t, "name": n} for t, n in LEVELS]}


# Lambda handler via Mangum
handler = Mangum(app)
