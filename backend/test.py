import os
import traceback
from app.services.gemini_service import analyze_message

print("GEMINI_API_KEY present:", bool(os.getenv("GEMINI_API_KEY")))

try:
    result = analyze_message(
        "Congratulations! Pay ₹499 to verify your internship."
    )
    print("Result:", result)
except Exception:
    print("analyze_message raised an exception:")
    traceback.print_exc()