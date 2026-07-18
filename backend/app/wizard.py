"""AI Wizard: Bedrock integration with fantasy persona and RAG."""

import json
import os
import boto3
from typing import Optional

from .models import Source, PlayerState

# Bedrock client - initialized once per Lambda cold start
bedrock_runtime = boto3.client("bedrock-runtime", region_name=os.environ.get("AWS_REGION", "us-east-1"))
bedrock_agent_runtime = boto3.client(
    "bedrock-agent-runtime", region_name=os.environ.get("AWS_REGION", "us-east-1")
)

KNOWLEDGE_BASE_ID = os.environ.get("BEDROCK_KNOWLEDGE_BASE_ID", "")
MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "anthropic.claude-3-sonnet-20240229-v1:0")

# The wizard's system prompt - defines persona and behavior
WIZARD_SYSTEM_PROMPT = """You are Cloudius the Eternal, an ancient wizard who has spent millennia studying the arcane arts of cloud computing. You reside in the Tower of Infinite Scale, where the mystical forces of AWS flow through enchanted crystals.

Your personality:
- Wise, patient, and slightly dramatic
- You speak in a mystical/fantasy style but remain TECHNICALLY ACCURATE
- You refer to AWS services using fantasy metaphors while clearly stating the real service name
- You encourage curiosity and deeper exploration
- You celebrate the learner's progress

Your naming conventions for AWS concepts:
- Servers/EC2 = "Conjured Golems" or "Summoned Instances"
- Lambda = "Ephemeral Spirits" or "Serverless Familiars"
- S3 = "The Infinite Vault" or "Boundless Archives"
- VPC = "Warded Domains" or "Protected Realms"
- IAM = "The Gatekeeper's Ledger" or "Seals of Authority"
- DynamoDB = "The Living Scroll" (ever-changing, schema-free)
- CloudFormation = "Infrastructure Incantations"
- API Gateway = "The Portal Keeper"
- Load Balancer = "The Traffic Sorceress"
- Auto Scaling = "The Multiplication Enchantment"
- Security Groups = "Firewall Wards"
- Route 53 = "The Wayfinder" (DNS)
- CloudWatch = "The All-Seeing Eye"
- SNS = "The Herald's Horn" (notifications)
- SQS = "The Queue of Whispers" (message queue)

Rules:
1. ALWAYS provide the real AWS service name alongside the fantasy name
2. Be technically accurate - never sacrifice correctness for flavor
3. When citing sources, mention them naturally: "As written in the ancient scrolls of AWS documentation..."
4. Encourage follow-up questions: "Shall I reveal more about this particular enchantment?"
5. Adapt depth to the learner's level (check their player level)
6. For Apprentices: focus on high-level concepts and analogies
7. For Journeyman+: include more technical details, best practices
8. For Adept+: discuss advanced patterns, edge cases, cost optimization
9. For Mage+: architecture patterns, multi-service orchestration
10. Keep responses concise but complete - aim for 2-4 paragraphs unless they ask for more detail

Current player level: {level_name} (Level {level})
Topics they've explored: {topics}
"""


def get_level_context(player_state: Optional[PlayerState]) -> str:
    """Build level-appropriate context for the system prompt."""
    if player_state is None:
        return WIZARD_SYSTEM_PROMPT.format(
            level_name="Apprentice", level=1, topics="None yet"
        )
    return WIZARD_SYSTEM_PROMPT.format(
        level_name=player_state.level_name,
        level=player_state.level,
        topics=", ".join(player_state.topics_explored) if player_state.topics_explored else "None yet",
    )


async def query_knowledge_base(query: str) -> tuple[str, list[Source]]:
    """
    Query the Bedrock Knowledge Base for relevant AWS documentation.

    Returns the retrieved context and source citations.
    """
    sources: list[Source] = []
    context_text = ""

    if not KNOWLEDGE_BASE_ID:
        # Fallback: no knowledge base configured, just use model knowledge
        return context_text, sources

    try:
        response = bedrock_agent_runtime.retrieve(
            knowledgeBaseId=KNOWLEDGE_BASE_ID,
            retrievalQuery={"text": query},
            retrievalConfiguration={
                "vectorSearchConfiguration": {
                    "numberOfResults": 5,
                }
            },
        )

        results = response.get("retrievalResults", [])
        for result in results:
            content = result.get("content", {}).get("text", "")
            location = result.get("location", {})

            # Build source citation
            source_url = None
            source_title = "AWS Documentation"

            if location.get("type") == "S3":
                uri = location.get("s3Location", {}).get("uri", "")
                source_title = uri.split("/")[-1].replace(".pdf", "").replace(".html", "")
            elif location.get("type") == "WEB":
                source_url = location.get("webLocation", {}).get("url", "")
                source_title = source_url.split("/")[-1] if source_url else "AWS Docs"

            if content:
                context_text += f"\n{content}\n"
                sources.append(
                    Source(title=source_title, url=source_url, snippet=content[:200])
                )

    except Exception as e:
        print(f"Knowledge Base query failed: {e}")
        # Continue without RAG context - model will use its training data

    return context_text, sources


async def ask_wizard(
    message: str, player_state: Optional[PlayerState] = None, conversation_history: Optional[list] = None
) -> tuple[str, list[Source]]:
    """
    Send a message to the wizard and get a response.

    Uses RAG (Knowledge Base) for grounded answers with citations.
    """
    # Get relevant documentation from Knowledge Base
    rag_context, sources = await query_knowledge_base(message)

    # Build the system prompt with player context
    system_prompt = get_level_context(player_state)

    # Add RAG context if available
    if rag_context:
        system_prompt += f"""

REFERENCE MATERIAL (from AWS documentation - cite these as "the ancient scrolls"):
{rag_context}

Use this reference material to ground your answer. Always be accurate.
If the reference material doesn't cover the question, use your general knowledge but note that.
"""

    # Build messages
    messages = []

    # Include recent conversation history for continuity
    if conversation_history:
        for msg in conversation_history[-6:]:  # Last 3 exchanges
            messages.append(msg)

    messages.append({"role": "user", "content": message})

    # Call Bedrock (Claude)
    try:
        body = json.dumps(
            {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1024,
                "system": system_prompt,
                "messages": messages,
            }
        )

        response = bedrock_runtime.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            accept="application/json",
            body=body,
        )

        response_body = json.loads(response["body"].read())
        wizard_reply = response_body["content"][0]["text"]

    except Exception as e:
        print(f"Bedrock invocation failed: {e}")
        wizard_reply = (
            "Alas, young seeker... the magical energies are disrupted at this moment. "
            "The crystal conduits to the Cloud Realm appear clouded. "
            "Perhaps try your question again in a moment, or ask me something else. "
            f"(Technical note: {type(e).__name__})"
        )

    return wizard_reply, sources
