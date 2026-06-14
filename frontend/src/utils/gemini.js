// Helper to connect to Gemini API directly from browser using client key
// No personal data is sent to intermediate servers, keeping it privacy-first.

export async function analyzeMessageWithGemini(text, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert cybersecurity scam detection engine. Analyze the message below for phishing, job fraud, banking scams, investment scams, OTP requests, or delivery scams.
            
            Return your response in standard JSON format:
            {
              "risk": "High" | "Medium" | "Low" | "Safe",
              "type": "Banking Scam" | "Job Scam" | "Investment Fraud" | "OTP Scam" | "Delivery Scam" | "Legitimate Notification" | "Unknown",
              "indicators": ["List of indicators, e.g. Urgency, Suspect link, False promise"],
              "explanation": "A clean, educational 2-3 sentence explanation of the specific manipulation tricks used and what red flags to spot."
            }

            Message: "${text.replace(/"/g, '\\"')}"`
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      throw new Error(`Gemini API Error: ${errorMsg}`);
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.error("Gemini Analysis Failed: ", error);
    throw error;
  }
}

export async function generateScammerResponse(history, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are simulating a malicious scammer roleplay for a cybersecurity training game.
            The user is a candidate playing along. Keep your response realistic, persuasive, and relatively brief (1-3 sentences).
            Use manipulation techniques (urgency, authority, fear, greed, or fake trust) depending on your character.
            Do NOT break character. Try to guide them into sharing a fake passcode/OTP, downloading a remote screen sharing application, or transferring a registration deposit.
            
            Return your response in standard JSON format:
            {
              "reply": "Scammer text response",
              "isEnd": false,
              "rating": null,
              "tactics": ["List of techniques you just used in this reply, e.g. Urgency, Authority, Fear"]
            }

            Here is the chat history:
            ${JSON.stringify(history)}`
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error("API call failed");
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.error("Gemini Chat Simulation Failed: ", error);
    throw error;
  }
}
