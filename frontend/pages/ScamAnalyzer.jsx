import { useState } from "react";

function ScamAnalyzer() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    setResult({
      risk: "High",
      scamType: "Job Scam",
      redFlags: [
        "Payment Request",
        "Urgency",
        "Too Good To Be True"
      ],
      recommendation: "Do not send money."
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Scam Message Analyzer</h1>

      <textarea
        rows="8"
        cols="60"
        placeholder="Paste suspicious message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleAnalyze}>
        Analyze
      </button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Result</h2>

          <p>
            <strong>Risk Level:</strong> {result.risk}
          </p>

          <p>
            <strong>Scam Type:</strong> {result.scamType}
          </p>

          <p>
            <strong>Red Flags:</strong>
          </p>

          <ul>
            {result.redFlags.map((flag, index) => (
              <li key={index}>{flag}</li>
            ))}
          </ul>

          <p>
            <strong>Recommendation:</strong>{" "}
            {result.recommendation}
          </p>
        </div>
      )}
    </div>
  );
}

export default ScamAnalyzer;