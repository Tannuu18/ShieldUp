import os
from dotenv import load_dotenv
import google.generativeai as genai
from PIL import Image

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.0-flash")

def analyze_screenshot(image_path):

    image = Image.open(image_path)

    prompt = """
    You are a cybersecurity expert.

    Analyze this screenshot.

    Identify:

    1. Risk Level
    2. Is it phishing?
    3. Red Flags
    4. Recommendation

    Look for:
    - Fake login pages
    - Brand impersonation
    - Suspicious links
    - Urgency tactics
    - Payment scams

    Return a clear response.
    """

    response = model.generate_content(
        [prompt, image]
    )

    return response.text