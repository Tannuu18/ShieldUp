import React, { useState } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { MESSAGE_SAMPLES } from '../utils/mockData';
import { analyzeMessageWithGemini } from '../utils/gemini';
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export default function MessageAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const parseJSONFromText = (text) => {
    try {
      // 1. Direct parsing
      return JSON.parse(text.trim());
    } catch (e) {
      // 2. Try parsing contents between ```json and ``` block
      const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        try {
          return JSON.parse(match[1].trim());
        } catch (e2) {
          console.warn("Regex markdown block parse failed", e2);
        }
      }

      // 3. Fallback: Parse string by finding bounding brackets
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        try {
          return JSON.parse(text.substring(startIndex, endIndex + 1));
        } catch (e3) {
          console.warn("Index-based extraction parse failed", e3);
        }
      }

      throw new Error("Could not parse JSON content from backend response.");
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      try {
        response = await fetch('http://localhost:8000/analyze-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputText })
        });
      } catch (e) {
        // Fallback relative path
        response = await fetch('/analyze-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: inputText })
        });
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const parsedJson = parseJSONFromText(data.analysis);

      const mappedResult = {
        type: parsedJson.scam_type || "Unknown Threat",
        risk: parsedJson.risk || "Medium",
        indicators: parsedJson.red_flags || ["Suspect pattern"],
        explanation: parsedJson.recommendation || "Verify sender authenticity before clicking links or disclosing credentials."
      };

      setResult(mappedResult);
      
      // Save stats
      if (mappedResult.risk === 'High' || mappedResult.risk === 'Medium') {
        const totalScams = parseInt(localStorage.getItem('cybershield_scams_detected') || '0', 10);
        localStorage.setItem('cybershield_scams_detected', (totalScams + 1).toString());
      }
    } catch (err) {
      console.error("Message scan failed", err);
      setError("Failed to connect to the backend API. Please make sure the FastAPI server is running on http://localhost:8000.");
    } finally {
      setLoading(false);
    }
  };

  const selectSample = (sample) => {
    setInputText(sample.text);
    setResult(null);
  };

  const getRiskStyles = (risk) => {
    const mapping = {
      High: { border: 'border-cyber-red', text: 'text-cyber-red', bg: 'bg-cyber-red/10', icon: <ShieldAlert className="w-5 h-5" /> },
      Medium: { border: 'border-cyber-yellow', text: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', icon: <AlertTriangle className="w-5 h-5" /> },
      Low: { border: 'border-cyber-cyan', text: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10', icon: <HelpCircle className="w-5 h-5" /> },
      Safe: { border: 'border-cyber-green', text: 'text-cyber-green', bg: 'bg-cyber-green/10', icon: <CheckCircle className="w-5 h-5" /> }
    };
    return mapping[risk] || mapping.Low;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Scam Message Analyzer</h2>
        <p className="text-gray-400 text-sm mt-1">
          Paste SMS, WhatsApp, Email messages, or generic texts to inspect for social engineering traits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-4">
              <label htmlFor="message-input" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Message Content
              </label>
              <textarea
                id="message-input"
                className="w-full h-44 bg-cyber-black/70 border border-cyber-border/80 focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] rounded-lg p-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none resize-none transition-all"
                placeholder="Paste the suspicious message text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-mono">
                  Characters: {inputText.length} | Privacy Assured 🔒
                </span>
                <Button 
                  onClick={handleAnalyze} 
                  disabled={!inputText.trim()} 
                  loading={loading}
                >
                  Analyze Text
                </Button>
              </div>
            </div>
          </Card>

          {/* Preset Samples */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Test Templates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MESSAGE_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => selectSample(sample)}
                  className={`text-left p-3 rounded-lg border text-xs transition-all hover:bg-cyber-lightGray/40 ${
                    inputText === sample.text 
                      ? 'border-cyber-cyan bg-cyber-cyan/5 text-white' 
                      : 'border-cyber-border/40 bg-cyber-gray/45 text-gray-400'
                  }`}
                >
                  <div className="font-bold text-gray-300">{sample.label}</div>
                  <div className="truncate mt-1 text-[11px] text-gray-500">{sample.text}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Section */}
        <div className="lg:col-span-1">
          {result ? (
            <Card className={`border-t-4 ${getRiskStyles(result.risk).border} h-full flex flex-col justify-between`}>
              <div className="space-y-6">
                {/* Risk Level Badge */}
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${getRiskStyles(result.risk).bg} ${getRiskStyles(result.risk).border}`}>
                  {getRiskStyles(result.risk).icon}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Analysis Result</div>
                    <div className={`text-xl font-black ${getRiskStyles(result.risk).text}`}>{result.risk} Risk</div>
                  </div>
                </div>

                {/* Threat Type */}
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Threat Category</h4>
                  <p className="text-sm font-semibold text-white">{result.type}</p>
                </div>

                {/* Red Flags Found */}
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Red Flags Detected</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.indicators.map((ind, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-mono px-2 py-1 rounded bg-cyber-lightGray border border-cyber-border text-gray-300"
                      >
                        • {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Explanations */}
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Social Engineering Analysis</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">{result.explanation}</p>
                </div>
              </div>

              {/* Recommendation Card */}
              <div className="mt-8 pt-4 border-t border-cyber-border/40">
                <div className="bg-cyber-black/40 border border-cyber-border/30 p-3.5 rounded-lg text-xs">
                  <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                    🛡️ ShieldUp Advisory
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-gray-400 text-[11px]">
                    {result.risk === 'High' || result.risk === 'Medium' ? (
                      <>
                        <li>Do NOT click any links inside the message.</li>
                        <li>Never share OTPs, passwords, or registration money.</li>
                        <li>Report and block the sender immediately.</li>
                      </>
                    ) : (
                      <>
                        <li>Verification links should only be visited directly on official domains.</li>
                        <li>Keep security scanners active when visiting urls.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full border-dashed border-cyber-border/60 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-cyber-lightGray/50 border border-cyber-border/60 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                <Sparkles className="w-6 h-6 text-cyber-cyan" />
              </div>
              <h4 className="text-sm font-bold text-gray-300">Scanner Idle</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1.5">
                Input your suspicious message content on the left pane and hit &apos;Analyze Text&apos; to view social engineering highlights.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
