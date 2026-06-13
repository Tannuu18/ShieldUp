import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function ScamAnalyzer() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);

  const analyzeMessage = () => {
    if (
      message.toLowerCase().includes("urgent") ||
      message.toLowerCase().includes("prize")
    ) {
      setResult({
        verdict: "Danger",
        confidence: 95,
      });
    } else {
      setResult({
        verdict: "Safe",
        confidence: 91,
      });
    }
  };

  return (
    <div className="bg-[#06111f] min-h-screen">
      <Sidebar />

      <div className="ml-64 p-8">
        <h1 className="text-4xl font-bold text-white">
          Scam Message Analyzer
        </h1>

        <p className="text-gray-400 mt-2">
          Analyze suspicious messages.
        </p>

        <div className="bg-[#0b1629] border border-[#1b2a44] rounded-xl mt-8 p-6">
          <textarea
            rows="12"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="w-full bg-[#06111f] border border-[#1b2a44] rounded-lg p-4 text-white"
            placeholder="Paste suspicious message..."
          />

          <button
            onClick={analyzeMessage}
            className="w-full mt-4 bg-cyan-400 text-black font-bold py-3 rounded-lg"
          >
            Initiate Scan
          </button>
        </div>

        {result && (
          <div className="bg-[#0b1629] border border-[#1b2a44] rounded-xl mt-6 p-6">
            <h2 className="text-white text-xl">
              Analysis Verdict
            </h2>

            <div className="flex justify-between mt-4">
              <span
                className={`px-4 py-2 rounded-full ${
                  result.verdict === "Danger"
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              >
                {result.verdict}
              </span>

              <span className="text-white">
                {result.confidence}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}