
import os
import logging
import requests

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


# ==================================================
# PROVIDER CONFIGURATION
# ==================================================

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile"
).strip()

CLOUDFLARE_MODEL = os.getenv(
    "CLOUDFLARE_MODEL",
    "@cf/zai-org/glm-4.7-flash"
).strip()

CLOUDFLARE_API_BASE = (
    "https://api.cloudflare.com/client/v4/accounts/"
)

TIMEOUT = (15, 45)
MAX_OUTPUT_TOKENS = 700


# ==================================================
# CUSTOM ERROR
# ==================================================

class AIProviderError(Exception):
    pass


# ==================================================
# VALIDATE CONVERSATION MESSAGES
# ==================================================

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

    system_messages = [
        msg for msg in cleaned
        if msg["role"] == "system"
    ]

    if len(system_messages) > 1:
        raise AIProviderError(
            "Only one system instruction is allowed."
        )

    history = [
        msg for msg in cleaned
        if msg["role"] != "system"
    ]

    if system_messages:
        return system_messages + history[-13:]

    return history[-14:]


# ==================================================
# EXTRACT ERROR DETAILS FROM PROVIDER RESPONSE
# ==================================================

def extract_error_detail(response):

    try:
        data = response.json()

        if isinstance(data, dict):

            error = data.get("error")

            if isinstance(error, dict):
                detail = error.get("message")

                if detail:
                    return str(detail)[:1200]

            if isinstance(error, str):
                return error[:1200]

            errors = data.get("errors")

            if isinstance(errors, list) and errors:
                return str(errors[:3])[:1200]

            if data.get("message"):
                return str(data["message"])[:1200]

    except ValueError:
        pass

    return response.text[:1200]


# ==================================================
# EXTRACT TEXT FROM CHAT COMPLETION RESPONSE
# ==================================================

def extract_reply(data):

    if not isinstance(data, dict):
        raise AIProviderError(
            "Provider response is not a JSON object."
        )

    choices = data.get("choices")

    if not isinstance(choices, list) or not choices:
        return None

    first_choice = choices[0]

    if not isinstance(first_choice, dict):
        return None

    message = first_choice.get("message")

    if not isinstance(message, dict):
        return None

    content = message.get("content")

    # Normal OpenAI-compatible response.
    if isinstance(content, str):
        return content.strip()

    # Handle providers returning content as text parts.
    if isinstance(content, list):

        text_parts = []

        for part in content:

            if isinstance(part, dict):
                text = part.get("text")

                if isinstance(text, str):
                    text_parts.append(text)

            elif isinstance(part, str):
                text_parts.append(part)

        return "\n".join(text_parts).strip()

    return None


# ==================================================
# COMMON PROVIDER REQUEST FUNCTION
# ==================================================

def call_provider(
    provider_name,
    url,
    api_key,
    model,
    messages
):

    if not api_key:
        raise AIProviderError(
            f"{provider_name} API key is missing."
        )

    if not model:
        raise AIProviderError(
            f"{provider_name} model is not configured."
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    payload = {
        "model": model,
        "messages": messages,
        "max_completion_tokens": MAX_OUTPUT_TOKENS,
        "stream": False
    }

    logger.info(
        "Calling %s using model: %s",
        provider_name,
        model
    )

    # Send request.
    try:

        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=TIMEOUT
        )

    except requests.Timeout as error:

        logger.exception(
            "%s request timed out.",
            provider_name
        )

        raise AIProviderError(
            f"{provider_name} request timed out."
        ) from error

    except requests.RequestException as error:

        logger.exception(
            "%s network request failed.",
            provider_name
        )

        raise AIProviderError(
            f"{provider_name} network request failed."
        ) from error

    # Check HTTP status.
    if not response.ok:

        detail = extract_error_detail(response)

        logger.error(
            "%s HTTP error | Status: %s | Details: %s",
            provider_name,
            response.status_code,
            detail
        )

        raise AIProviderError(
            f"{provider_name} returned HTTP "
            f"{response.status_code}."
        )

    # Parse JSON response.
    try:

        data = response.json()

    except ValueError as error:

        logger.error(
            "%s returned invalid JSON: %s",
            provider_name,
            response.text[:1200]
        )

        raise AIProviderError(
            f"{provider_name} returned invalid JSON."
        ) from error

    # Extract generated response.
    reply = extract_reply(data)

    if not reply:

        logger.error(
            "%s returned an empty or unexpected response. "
            "Response: %s",
            provider_name,
            str(data)[:1500]
        )

        raise AIProviderError(
            f"{provider_name} returned an empty response."
        )

    logger.info(
        "%s request successful.",
        provider_name
    )

    return reply


# ==================================================
# PRIMARY PROVIDER: GROQ
# ==================================================

def call_groq(messages):

    api_key = os.getenv("GROQ_API_KEY", "").strip()

    return call_provider(
        provider_name="Groq",
        url=GROQ_API_URL,
        api_key=api_key,
        model=GROQ_MODEL,
        messages=messages
    )


# ==================================================
# BACKUP PROVIDER: CLOUDFLARE
# ==================================================

def call_cloudflare(messages):

    api_key = os.getenv(
        "CLOUDFLARE_API_TOKEN", ""
    ).strip()

    account_id = os.getenv(
        "CLOUDFLARE_ACCOUNT_ID", ""
    ).strip()

    if not account_id:
        raise AIProviderError(
            "Cloudflare account ID is missing."
        )

    url = (
        f"{CLOUDFLARE_API_BASE}"
        f"{account_id}/ai/v1/chat/completions"
    )

    return call_provider(
        provider_name="Cloudflare",
        url=url,
        api_key=api_key,
        model=CLOUDFLARE_MODEL,
        messages=messages
    )


# ==================================================
# MAIN FUNCTION: GROQ FIRST, CLOUDFLARE SECOND
# ==================================================

def generate_chat_response(messages):

    messages = validate_messages(messages)

    # Attempt 1: Groq
    try:

        reply = call_groq(messages)

        return {
            "reply": reply,
            "provider": "groq"
        }

    except AIProviderError as error:

        logger.warning(
            "Primary provider failed: %s",
            error
        )

    # Attempt 2: Cloudflare
    try:

        reply = call_cloudflare(messages)

        return {
            "reply": reply,
            "provider": "cloudflare"
        }

    except AIProviderError as error:

        logger.error(
            "Backup provider failed: %s",
            error
        )

    # Both providers failed.
    logger.error(
        "Both AI providers failed. "
        "No response could be generated."
    )

    raise AIProviderError(
        "Our AI assistant is temporarily unavailable. "
        "Please try again later."
    )
