"""Service wrapper around the Gemini generative model."""

import os
from dotenv import load_dotenv
import google.generativeai as genai
import google.api_core.exceptions as google_exceptions

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

# Allow overriding the model via environment variable for flexibility
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


def analyze_message(message: str) -> str:
    """Analyze a message string and return analysis text.

    Args:
        message: The message to analyze.

    Returns:
        The textual analysis returned by the model.
    """

    prompt = f"""
    You are a cybersecurity expert.

    Analyze the message below.

    Return:
    Risk Level
    Scam Type
    Red Flags
    Recommendation

    Message:
    {message}
    """

    # Create the model object here so the model name can be changed at runtime
    model = genai.GenerativeModel(MODEL_NAME)

    try:
        response = model.generate_content(prompt)
        return getattr(response, "text", str(response))
    except google_exceptions.NotFound as e:
        raise RuntimeError(
            f"Model '{MODEL_NAME}' not found or unsupported for this API version."
            " Check your model name or call the ModelService ListModels endpoint."
        ) from e