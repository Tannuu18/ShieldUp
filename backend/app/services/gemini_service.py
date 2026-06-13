import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_message(message):
    prompt = f"""
    Analyze this message and return ONLY JSON.

    Format:

    {{
        "risk":"High",
        "scam_type":"Job Scam",
        "red_flags":[
            "Payment Request",
            "Urgency"
        ],
        "recommendation":"Do not send money."
    }}

    Message:
    {message}
    """
    response = model.generate_content(prompt)

    return response.text