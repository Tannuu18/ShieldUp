from app.services.gemini_service import analyze_message

result = analyze_message(
    "Congratulations! Pay ₹499 for internship verification."
)

print(result)