import React, { useState } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { Shield, ShieldAlert, ShieldCheck, Globe, Key, AlertTriangle, Info, Search } from 'lucide-react';

export default function URLScanner() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const getDomainName = (input) => {
    let clean = input.trim().toLowerCase();
    // remove protocol
    clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '');
    // remove paths
    clean = clean.split('/')[0];
    return clean;
  };

  const parseAIResponse = (text, domain) => {
    let riskLevel = "Medium";
    let riskScore = 50;
    let reasons = [];
    let recommendation = "";

    const lines = text.split('\n');
    let currentSection = ""; // "level", "score", "reasons", "rec"

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const lower = trimmed.toLowerCase();

      // Check section transitions
      if (lower.includes("risk level") || (lower.includes("level") && lower.includes("risk"))) {
        currentSection = "level";
      } else if (lower.includes("risk score") || (lower.includes("score") && lower.includes("risk"))) {
        currentSection = "score";
      } else if (lower.includes("reasons") || lower.includes("reason")) {
        currentSection = "reasons";
        return; // Skip reading this header line as a reason
      } else if (lower.includes("recommendation") || lower.includes("recommendations")) {
        currentSection = "rec";
        return; // Skip reading this header line as recommendation
      }

      // Parse values based on current section
      const cleanContent = trimmed.replace(/^[-*•\d\.\:\s\*]+/, '').trim();
      
      if (currentSection === "level") {
        const match = trimmed.match(/(?:level|risk)\s*:\s*(\w+)/i) || trimmed.match(/(\w+)\s+risk/i);
        if (match && match[1]) {
          riskLevel = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        } else {
          if (lower.includes("high") || lower.includes("critical")) riskLevel = "High";
          else if (lower.includes("medium")) riskLevel = "Medium";
          else if (lower.includes("low")) riskLevel = "Low";
          else if (lower.includes("safe") || lower.includes("clean")) riskLevel = "Safe";
        }
      } else if (currentSection === "score") {
        const match = trimmed.match(/\b(\d+)\b/);
        if (match && match[1]) {
          riskScore = parseInt(match[1], 10);
        }
      } else if (currentSection === "reasons") {
        const item = trimmed.replace(/^[-*•\d\.\s]+/, '').trim();
        if (item && item.length > 5 && !item.toLowerCase().includes("reasons")) {
          reasons.push(item);
        }
      } else if (currentSection === "rec") {
        const item = trimmed.replace(/^[-*•\d\.\s]+/, '').trim();
        if (item && !item.toLowerCase().includes("recommendation")) {
          if (recommendation) {
            recommendation += " " + item;
          } else {
            recommendation = item;
          }
        }
      }
    });

    if (reasons.length === 0) {
      // Fallback: extract list items manually if section headings weren't caught
      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
          const item = trimmed.replace(/^[-*•\s]+/, '').trim();
          if (item) reasons.push(item);
        }
      });
    }

    if (isNaN(riskScore) || riskScore < 0 || riskScore > 100) {
      riskScore = riskLevel === "High" ? 85 : riskLevel === "Medium" ? 45 : 12;
    }

    return {
      domain,
      riskScore,
      riskLevel,
      reasons: reasons.length > 0 ? reasons : ["Analyzed by CyberShield AI."],
      recommendation: recommendation || "Avoid clicking or sharing details unless verified through official communication channels.",
      rawText: text
    };
  };

  const scanURL = async () => {
    if (!urlInput.trim()) return;
    setLoading(true);
    setResult(null);
    setErrorMsg('');

    const domain = getDomainName(urlInput);

    try {
      let response;
      try {
        response = await fetch('http://localhost:8000/scan-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: urlInput })
        });
      } catch (e) {
        // Fallback relative path
        response = await fetch('/scan-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: urlInput })
        });
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const parsed = parseAIResponse(data.analysis, domain);
      setResult(parsed);
      
      // Save stats
      if (parsed.riskScore >= 50) {
        const totalScams = parseInt(localStorage.getItem('cybershield_scams_detected') || '0', 10);
        localStorage.setItem('cybershield_scams_detected', (totalScams + 1).toString());
      }
    } catch (err) {
      console.error("URL scan failed", err);
      setErrorMsg("Failed to connect to the backend API. Please make sure the FastAPI server is running on http://localhost:8000.");
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (domain) => {
    setUrlInput(domain);
    setResult(null);
    setErrorMsg('');
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-cyber-red border-cyber-red/30';
    if (score >= 40) return 'text-cyber-yellow border-cyber-yellow/30';
    return 'text-cyber-green border-cyber-green/30';
  };

  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-cyber-red/10';
    if (score >= 40) return 'bg-cyber-yellow/10';
    return 'bg-cyber-green/10';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white">URL Safety Scanner</h2>
        <p className="text-gray-400 text-sm mt-1">
          Inspect any link to audit domain registration, certificate structures, and brand spoofing signals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Input Pane */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-4">
              <label htmlFor="url-input" className="block text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Enter Suspicious Link
              </label>
              <div className="relative">
                <input
                  id="url-input"
                  type="text"
                  className="w-full bg-cyber-black/75 border border-cyber-border/80 focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.1)] rounded-lg py-3.5 pl-11 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition-all"
                  placeholder="https://example-claims-refund.net"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-4 top-3.5" />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-gray-500 font-mono">
                  Enter full URL or just the domain name
                </span>
                <Button 
                  onClick={scanURL} 
                  disabled={!urlInput.trim()} 
                  loading={loading}
                >
                  Scan URL
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick presets */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Test Presets
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => selectPreset("http://icici-verify-security.in/login")}
                className="p-3 border border-cyber-border/40 bg-cyber-gray/45 rounded-lg text-left text-xs transition-all hover:bg-cyber-lightGray/40 text-gray-300 hover:border-cyber-cyan/50"
              >
                <div className="font-bold text-cyber-red">Spoofed ICICI Bank</div>
                <div className="truncate text-gray-500 text-[10px] mt-0.5">icici-verify-security.in</div>
              </button>
              <button
                onClick={() => selectPreset("http://fedex-customs-clearance.net/pay")}
                className="p-3 border border-cyber-border/40 bg-cyber-gray/45 rounded-lg text-left text-xs transition-all hover:bg-cyber-lightGray/40 text-gray-300 hover:border-cyber-cyan/50"
              >
                <div className="font-bold text-cyber-red">FedEx Courier Lure</div>
                <div className="truncate text-gray-500 text-[10px] mt-0.5">fedex-customs-clearance.net</div>
              </button>
              <button
                onClick={() => selectPreset("https://www.amazon.in")}
                className="p-3 border border-cyber-border/40 bg-cyber-gray/45 rounded-lg text-left text-xs transition-all hover:bg-cyber-lightGray/40 text-gray-300 hover:border-cyber-cyan/50"
              >
                <div className="font-bold text-cyber-green font-mono">amazon.in (Official)</div>
                <div className="truncate text-gray-500 text-[10px] mt-0.5">amazon.in</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Details Pane */}
        <div className="lg:col-span-1">
          {errorMsg && (
            <Card className="border-cyber-red border-t-4 bg-cyber-red/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyber-red font-bold text-sm">
                <ShieldAlert className="w-5 h-5" /> Connection Failed
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{errorMsg}</p>
            </Card>
          )}

          {result ? (
            <Card className="space-y-6 h-full flex flex-col justify-between">
              <div>
                {/* Dial Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono truncate max-w-[150px]">{result.domain}</h3>
                    <p className="text-[10px] text-gray-500 font-mono">Domain Security Audit</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-center ${getScoreColor(result.riskScore)} ${getScoreBg(result.riskScore)}`}>
                    <div className="text-[9px] uppercase tracking-wider text-gray-400">Risk Score</div>
                    <div className="text-xl">{result.riskScore}/100</div>
                  </div>
                </div>

                {/* Main Security Stats */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-6">
                  <div className="p-3 bg-cyber-black/40 border border-cyber-border/30 rounded-lg flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-cyber-cyan" /> Risk Level
                    </div>
                    <span className={`font-semibold mt-1.5 ${getScoreColor(result.riskScore)}`}>{result.riskLevel}</span>
                  </div>
                  <div className="p-3 bg-cyber-black/40 border border-cyber-border/30 rounded-lg flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-cyber-purple" /> Status
                    </div>
                    <span className={`font-semibold mt-1.5 ${result.riskScore >= 50 ? 'text-cyber-red' : 'text-cyber-green'}`}>
                      {result.riskScore >= 50 ? 'Suspicious' : 'Clean / Safe'}
                    </span>
                  </div>
                </div>

                {/* Threat indicators */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Technical Flags Explained</h4>
                    <ul className="space-y-2.5">
                      {result.reasons.map((reason, i) => (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                          <span className="mt-0.5 text-cyber-magenta select-none">✕</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Complete Raw AI Analysis box */}
                  <div className="mt-6 pt-4 border-t border-cyber-border/30">
                    <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Complete AI Report</h4>
                    <div className="p-3 bg-cyber-black/50 border border-cyber-border/40 rounded-lg max-h-36 overflow-y-auto">
                      <pre className="text-[10px] text-gray-400 font-sans whitespace-pre-wrap leading-relaxed">{result.rawText}</pre>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation banner */}
              <div className="border-t border-cyber-border/30 pt-4 mt-6">
                <div className="p-3 bg-cyber-lightGray/30 rounded-lg flex gap-2.5">
                  <Info className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">AI Recommendation</span>
                    <p className="text-xs text-gray-300 leading-relaxed mt-1">{result.recommendation}</p>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            !errorMsg && (
              <Card className="h-full border-dashed border-cyber-border/60 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
                <div className="w-16 h-16 rounded-full bg-cyber-lightGray/50 border border-cyber-border/60 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                  <Shield className="w-6 h-6 text-cyber-purple" />
                </div>
                <h4 className="text-sm font-bold text-gray-300">Scanner Idle</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1.5">
                  Paste a suspicious URL in the input field to parse SSL registries, WHOIS dates, and trademark impersonation alerts via the Gemini-powered backend.
                </p>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}

