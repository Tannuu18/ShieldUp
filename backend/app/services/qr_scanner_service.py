import httpx
import json
from app.services.gemini_service import model

def analyze_qr(url: str):
    redirects = [url]
    current_url = url

    # 1. Trace redirects programmatically
    try:
        with httpx.Client(follow_redirects=False, timeout=5.0) as client:
            for _ in range(5):
                response = client.get(current_url)
                if response.status_code in (301, 302, 303, 307, 308):
                    location = response.headers.get("Location")
                    if location:
                        if location.startswith("/"):
                            from urllib.parse import urlparse
                            parsed = urlparse(current_url)
                            location = f"{parsed.scheme}://{parsed.netloc}{location}"
                        current_url = location
                        redirects.append(current_url)
                    else:
                        break
                else:
                    break
    except Exception as e:
        print(f"Redirect trace warning: {e}")
        pass

    # 2. Invoke Gemini model
    prompt = f"""
    You are a cybersecurity expert scanner.
    Analyze the destination URL decoded from a QR code and its redirect chain.
    QR codes that redirect to unknown portals, credential forms, payment requests, or contain suspicious query tokens represent phishing vectors.

    Redirect Chain traced:
    {json.dumps(redirects)}

    Return strictly a JSON object with this format:
    {{
        "risk_score": 85,
        "reasons": [
            "Matches trademark lookalike domains.",
            "Uses a temporary registry (.xyz)."
        ]
    }}
    """

    try:
        response = model.generate_content(prompt)
        text_content = response.text.strip()
        if text_content.startswith("```"):
            lines = text_content.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text_content = "\n".join(lines).strip()
            
        ai_data = json.loads(text_content)
    except Exception as e:
        print(f"Gemini scan parsing error: {e}")
        is_risky = any(x in current_url for x in [".xyz", ".cc", "rewards", "claim", "free", "paytm"])
        ai_data = {
            "risk_score": 80 if is_risky else 15,
            "reasons": [
                "Dynamic scan flagged redirection targets." if is_risky else "Redirection path appears normal."
            ]
        }

    return {
        "decodedUrl": url,
        "riskScore": ai_data.get("risk_score", 50),
        "redirects": redirects,
        "reasons": ai_data.get("reasons", ["Analyzed by threat intelligence engine."])
    }