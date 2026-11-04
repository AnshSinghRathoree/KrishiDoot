import os
import logging
import requests

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# --------------------------------------------------
# Provider configuration
# --------------------------------------------------

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "qwen/qwen3.8-27b"
)

CLOUDFLARE_MODEL = os.getenv(
    "CLOUDFLARE_MODEL",
    "@cf/zai-org/glm-4.7-flash"
)

TIMEOUT = 45
MAX_OUTPUT_TOKENS = 700


# --------------------------------------------------
# Custom error
# --------------------------------------------------

class AIProviderError(Exception):
    pass


# --------------------------------------------------
# Validate conversation messages
# --------------------------------------------------

def validate_messages(messages):

    if not isinstance(messages, list) or not messages:
        raise AIProviderError("Invalid conversation messages.")

    cleaned = []

    for message in messages:

        if not isinstance(message, dict):
            raise AIProviderError("Invalid message format.")

        role = message.get("role")
        content = message.get("content")

        if role not in ("system", "user", "assistant"):
            raise AIProviderError("Invalid message role.")

        if not isinstance(content, str) or not content.strip():
            raise AIProviderError("Message cannot be empty.")

        if len(content) > 15000:
            raise AIProviderError("Message is too long.")

        cleaned.append({
            "role": role,
            "content": content.strip()
        })

    # Preserve the system instruction and recent conversation.
    system_messages = [
        msg for msg in cleaned if msg["role"] == "system"
    ]

    if len(system_messages) > 1:
        raise AIProviderError("Only one system instruction is allowed.")

    history = [
        msg for msg in cleaned if msg["role"] != "system"
    ]

    if system_messages:
        return system_messages + history[-13:]

    return history[-14:]


# --------------------------------------------------
# Send request to an OpenAI-compatible API
# --------------------------------------------------

def call_provider(url, api_key, model, messages):

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": messages,
        "max_completion_tokens": MAX_OUTPUT_TOKENS,
        "stream": False
    }

    try:
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=TIMEOUT
        )

        response.raise_for_status()

        data = response.json()

        reply = data["choices"][0]["message"]["content"]

        if not isinstance(reply, str) or not reply.strip():
            raise AIProviderError("Provider returned an empty response.")

        return reply.strip()

    except requests.RequestException as error:
        raise AIProviderError("Provider request failed.") from error

    except (ValueError, KeyError, IndexError, TypeError) as error:
        raise AIProviderError("Invalid response from AI provider.") from error


# --------------------------------------------------
# Primary provider: Groq
# --------------------------------------------------

def call_groq(messages):

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise AIProviderError("Groq API key is missing.")

    return call_provider(
        url=GROQ_API_URL,
        api_key=api_key,
        model=GROQ_MODEL,
        messages=messages
    )


# --------------------------------------------------
# Backup provider: Cloudflare Workers AI
# --------------------------------------------------

def call_cloudflare(messages):

    api_key = os.getenv("CLOUDFLARE_API_TOKEN")
    account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")

    if not api_key or not account_id:
        raise AIProviderError("Cloudflare credentials are missing.")

    url = (
        f"https://api.cloudflare.com/client/v4/accounts/"
        f"{account_id}/ai/v1/chat/completions"
    )

    return call_provider(
        url=url,
        api_key=api_key,
        model=CLOUDFLARE_MODEL,
        messages=messages
    )


# --------------------------------------------------
# Main function: Groq first, Cloudflare second
# --------------------------------------------------

def generate_chat_response(messages):

    messages = validate_messages(messages)

    # Try Groq first.
    try:
        reply = call_groq(messages)

        return {
            "reply": reply,
            "provider": "groq"
        }

    except AIProviderError as error:
        logger.warning("Primary provider failed: %s", error)

    # If Groq fails, try Cloudflare.
    try:
        reply = call_cloudflare(messages)

        return {
            "reply": reply,
            "provider": "cloudflare"
        }

    except AIProviderError as error:
        logger.error("Backup provider failed: %s", error)

    raise AIProviderError(
        "Our AI assistant is temporarily unavailable. "
        "Please try again later."
    )