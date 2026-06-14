import json
from app.services.gemini_service import model

def get_emergency_guidance(message: str):
    """
    Formulates a custom incident response playbook with step-by-step containment guidelines
    using the Gemini API.
    """
    prompt = f"""
    You are an expert Cyber Incident Response Assistant.
    The user is reporting a cyber emergency or security compromise:
    "{message}"

    Generate immediate, highly actionable, step-by-step containment and mitigation instructions.
    Keep the tone calm, reassuring, and direct. Prioritize the steps (containment first, then credentials, then monitoring).

    Return strictly a JSON object with this format (do not return any markdown code block, strictly return valid raw JSON text):
    {{
        "reply": "A brief, reassuring introductory paragraph (1-2 sentences) explaining the threat and what they should do first.",
        "steps": [
            {{
                "title": "Title of the step (e.g. 1. Disconnect Network)",
                "detail": "Actionable detail instructions (1-2 sentences)."
            }}
        ]
    }}
    """

    try:
        response = model.generate_content(prompt)
        text_content = response.text.strip()
        
        # Clean any markdown block wrappers
        if text_content.startswith("```"):
            lines = text_content.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text_content = "\n".join(lines).strip()
            
        ai_data = json.loads(text_content)
    except Exception as e:
        print(f"Emergency copilot parsing failed: {e}")
        # Fallback guidance checklist
        ai_data = {
            "reply": "I understand you are experiencing a security incident. Let's contain the threat immediately.",
            "steps": [
                {
                    "title": "1. Disconnect Network Access",
                    "detail": "Turn off Wi-Fi or unplug your ethernet cable to stop any active data transmission."
                },
                {
                    "title": "2. Update Compromised Passwords",
                    "detail": "Change your credentials using a secure separate device."
                },
                {
                    "title": "3. Enable Multi-Factor Authentication",
                    "detail": "Toggle on 2FA using authentication apps to lock out repeat hijack attempts."
                }
            ]
        }

    return {
        "reply": ai_data.get("reply", "Let's contain this threat immediately."),
        "steps": ai_data.get("steps", [])
    }
