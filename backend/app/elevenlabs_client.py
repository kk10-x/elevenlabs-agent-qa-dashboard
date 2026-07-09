"""Thin async wrapper around the ElevenLabs Agents Platform SDK.

Conversations are long-running, so triggering one only returns a conversation_id;
callers must poll `get_conversation` until status leaves "processing".
"""

import asyncio

from elevenlabs.client import ElevenLabs

from app.config import settings

POLL_INTERVAL_SECONDS = 2
POLL_TIMEOUT_SECONDS = 120


class ElevenLabsAgentClient:
    def __init__(self, api_key: str | None = None):
        self._client = ElevenLabs(api_key=api_key or settings.elevenlabs_api_key)

    async def start_conversation(self, agent_id: str, initial_message: str) -> str:
        """Kick off a simulated conversation and return its conversation_id."""
        conversation = await asyncio.to_thread(
            self._client.conversational_ai.conversations.simulate,
            agent_id=agent_id,
            simulated_user_message=initial_message,
        )
        return conversation.conversation_id

    async def poll_until_complete(self, conversation_id: str) -> dict:
        """Poll conversation status until it finishes or the timeout elapses."""
        elapsed = 0
        while elapsed < POLL_TIMEOUT_SECONDS:
            conversation = await asyncio.to_thread(
                self._client.conversational_ai.conversations.get,
                conversation_id=conversation_id,
            )
            if conversation.status != "processing":
                return conversation.model_dump()
            await asyncio.sleep(POLL_INTERVAL_SECONDS)
            elapsed += POLL_INTERVAL_SECONDS
        raise TimeoutError(f"Conversation {conversation_id} did not complete in time")
