import React, { useState } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { MOCK_URLS } from '../mockData';
import { Shield, ShieldAlert, ShieldCheck, Globe, Key, AlertTriangle, Info, Search } from 'lucide-react';

export default function URLScanner() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const getDomainName = (input) => {
    let clean = input.trim().toLowerCase();
    // remove protocol
    clean = clean.replace(/^(https?:\/\/)?(www\.)?/, '');
    // remove paths
    clean = clean.split('/')[0];
    return clean;
  };

  const scanURL = async () => {
    if (!urlInput.trim()) return;
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const domain = getDomainName(urlInput);

    // 1. Check mock database first
    if (MOCK_URLS[domain]) {
      setResult(MOCK_URLS[domain]);
      setLoading(false);
      return;
    }

    // 2. Fallback Dynamic Heuristics Generator
    const brandKeywords = [
      { name: "Netflix", keys: ["netflix", "netflix-billing", "netflix-update"] },
      { name: "Chase Bank", keys: ["chase", "chase-online", "chase-bank"] },
      { name: "ICICI Bank", keys: ["icici", "icicibank", "icici-security"] },
      { name: "SBI Bank", keys: ["sbi", "onlinesbi", "sbi-card"] },
      { name: "Amazon", keys: ["amazon", "amzn", "amazon-refund"] },
      { name: "FedEx", keys: ["fedex", "fedex-clearance", "fedex-clear"] },
      { name: "PayPal", keys: ["paypal", "paypal-service"] }
    ];

    let riskScore = 15;
    const reasons = [];
    let detectedBrand = null;
    const isIpAddress = /^[0-9.]+$/.test(domain);

    // Check if domain matches any brand keyword but isn't official
    for (const b of brandKeywords) {
      const matchesKeyword = b.keys.some(k => domain.includes(k));
      const isOfficial = (b.name === "Amazon" && (domain === "amazon.in" || domain === "amazon.com")) ||
                         (b.name === "Netflix" && domain === "netflix.com") ||
                         (b.name === "Chase Bank" && domain === "chase.com") ||
                         (b.name === "PayPal" && domain === "paypal.com");
                         
      if (matchesKeyword && !isOfficial) {
        detectedBrand = b.name;
        riskScore = 85;
        reasons.push(`Domain mimics official trademark brand: '${b.name}'.`);
        break;
      }
    }

    if (domain.includes("verify") || domain.includes("login") || domain.includes("update") || domain.includes("refund") || domain.includes("security")) {
      riskScore = Math.max(riskScore, 75);
      reasons.push("URL contains high-urgency words ('verify', 'login', 'update').");
    }

    const tld = domain.split('.').pop();
    const highRiskTlds = ["info", "xyz", "top", "cf", "gq", "ml", "tk", "cc", "icu"];
    if (highRiskTlds.includes(tld)) {
      riskScore = Math.max(riskScore, 65);
      reasons.push(`Uses high-risk TLD (.${tld}) frequently used by temporary phishing campaigns.`);
    }

    if (isIpAddress) {
      riskScore = 95;
      reasons.push("URL uses a raw IP address instead of a standard hostname. Major brands never expose raw IPs to customers.");
    }

    if (reasons.length === 0) {
      // Safe random score
      riskScore = Math.floor(Math.random() * 25) + 10;
      reasons.push("No brand impersonation or malicious keywords found.");
      reasons.push("Domain exhibits standard registrar and SSL metrics.");
    } else {
      reasons.push("Using a short-lifetime free SSL certificate.");
      reasons.push("WHOIS registrant details are anonymized via privacy proxy services.");
    }

    const mockResult = {
      domain,
      riskScore,
      domainAge: riskScore > 60 ? `${Math.floor(Math.random() * 20) + 1} days` : `${Math.floor(Math.random() * 10) + 2} years`,
      sslValid: riskScore < 90,
      sslIssuer: riskScore > 60 ? "Let's Encrypt (Free DV)" : "DigiCert high-assurance CA",
      whois: {
        registrar: riskScore > 60 ? "Namecheap Inc." : "MarkMonitor Inc.",
        registrantCountry: riskScore > 60 ? "IS" : "US",
        creationDate: riskScore > 60 ? "2026-06-05" : "2012-05-18",
        expiryDate: "2027-06-05"
      },
      threatDatabaseFlags: riskScore > 75 ? ["Reported in crowd-sourced blocklists"] : [],
      reasons
    };

    setResult(mockResult);
    setLoading(false);
  };

  const selectPreset = (domain) => {
    setUrlInput(domain);
    setResult(null);
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
                      <Globe className="w-3.5 h-3.5 text-cyber-cyan" /> Domain Age
                    </div>
                    <span className="font-semibold text-white mt-1.5">{result.domainAge}</span>
                  </div>
                  <div className="p-3 bg-cyber-black/40 border border-cyber-border/30 rounded-lg flex flex-col justify-between">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-cyber-purple" /> SSL Status
                    </div>
                    <span className={`font-semibold mt-1.5 truncate ${result.sslValid ? 'text-cyber-green' : 'text-cyber-red'}`}>
                      {result.sslValid ? 'Valid' : 'Expired/Unsecure'}
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

                  {result.threatDatabaseFlags.length > 0 && (
                    <div className="mt-4 p-2.5 border border-cyber-red/20 bg-cyber-red/5 rounded-lg">
                      <div className="text-[10px] font-bold text-cyber-red uppercase flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> Security Blocklists
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Flagged in: {result.threatDatabaseFlags.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical breakdown banner */}
              <div className="border-t border-cyber-border/30 pt-4 mt-6">
                <div className="p-3 bg-cyber-lightGray/30 rounded-lg flex gap-2.5">
                  <Info className="w-4 h-4 text-cyber-cyan shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">WHOIS Record Metadata</span>
                    <div className="text-[10px] font-mono text-gray-400 space-y-0.5 mt-1">
                      <div>Registrar: {result.whois.registrar}</div>
                      <div>Country: {result.whois.registrantCountry}</div>
                      <div>Created: {result.whois.creationDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full border-dashed border-cyber-border/60 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-cyber-lightGray/50 border border-cyber-border/60 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                <Shield className="w-6 h-6 text-cyber-purple" />
              </div>
              <h4 className="text-sm font-bold text-gray-300">Scanner Idle</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1.5">
                Paste a suspicious URL in the input field to parse SSL registries, WHOIS dates, and trademark impersonation alerts.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
