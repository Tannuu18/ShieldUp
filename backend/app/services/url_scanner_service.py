from app.services.gemini_service import model

def analyze_url(url):

    prompt = f"""
    You are a cybersecurity expert.

    Analyze this URL:
    {url}

    Return:
    1. Risk Level
    2. Risk Score
    3. Reasons
    4. Recommendation
    """

    response = model.generate_content(prompt)

    return response.text