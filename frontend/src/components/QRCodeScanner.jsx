import React, { useState } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { QrCode, ShieldAlert, CheckCircle, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';

export default function QRCodeScanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [presetActive, setPresetActive] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const presets = [
    {
      id: "paytm-cashback",
      title: "Fake Paytm Cashback reward QR",
      description: "Found on a social media group claiming to award ₹2000 instant cashback.",
      decodedUrl: "http://paytm-rewards-claim.xyz/cashback-payout?amount=2000"
    },
    {
      id: "parking-ticket",
      title: "Public Parking QR Code",
      description: "Pasted on a roadside parking meter asking to scan and pay fee.",
      decodedUrl: "http://quick-parking-meter-pay.cc/meter-201"
    }
  ];

  const triggerScan = async (preset) => {
    setLoading(true);
    setPresetActive(preset.id);
    setResult(null);
    setErrorMsg('');

    try {
      let response;
      try {
        response = await fetch('http://localhost:8000/scan-qr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: preset.decodedUrl })
        });
      } catch (e) {
        // Fallback relative path
        response = await fetch('/scan-qr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: preset.decodedUrl })
        });
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data.analysis);
      
      // Increment stats
      if (data.analysis.riskScore >= 50) {
        const totalScams = parseInt(localStorage.getItem('cybershield_scams_detected') || '0', 10);
        localStorage.setItem('cybershield_scams_detected', (totalScams + 1).toString());
      }
    } catch (err) {
      console.error("QR scan failed", err);
      setErrorMsg("Failed to connect to the backend API. Please make sure the FastAPI server is running on http://localhost:8000.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyles = (score) => {
    if (score >= 75) return { text: 'text-cyber-red', border: 'border-cyber-red/30', bg: 'bg-cyber-red/10', icon: <ShieldAlert className="w-5 h-5" /> };
    if (score >= 40) return { text: 'text-cyber-yellow', border: 'border-cyber-yellow/30', bg: 'bg-cyber-yellow/10', icon: <AlertTriangle className="w-5 h-5" /> };
    return { text: 'text-cyber-green', border: 'border-cyber-green/30', bg: 'bg-cyber-green/10', icon: <CheckCircle className="w-5 h-5" /> };
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white">QR Code Security Scanner</h2>
        <p className="text-gray-400 text-sm mt-1">
          Decode QR codes in a safe environment. Trace nested URL redirects and analyze the destination link before visiting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Mock Scanner Frame */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                {/* Camera Viewport Simulation */}
                <div className="w-48 h-48 border-2 border-cyber-cyan rounded-2xl flex items-center justify-center relative bg-cyber-black/75">
                  <div className="absolute inset-4 border border-cyber-cyan/30 rounded-xl flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-cyber-cyan/40 animate-pulse" />
                  </div>
                  {/* Glowing camera border dots */}
                  <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan rounded-tl-lg" />
                  <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan rounded-tr-lg" />
                  <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan rounded-bl-lg" />
                  <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan rounded-br-lg" />
                  
                  {/* Scan bar */}
                  <div className="absolute left-2 right-2 h-0.5 bg-cyber-cyan shadow-[0_0_10px_#00F0FF] animate-scanHorizontal" 
                       style={{
                         animation: 'scanVer 2s linear infinite',
                       }}
                  />
                </div>
                <div className="text-xs font-mono text-cyber-cyan animate-pulse">DECODING QR DATA PACKETS...</div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-32 h-32 border-2 border-cyber-border rounded-xl flex items-center justify-center bg-cyber-black/40">
                  <QrCode className="w-16 h-16 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white">Select a Suspect QR Code to Scan</h3>
                  <p className="text-xs text-gray-500 max-w-sm mt-1">
                    In a real application, you can use your phone camera or upload a QR image block. Choose a scenario template to test:
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  {presets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => triggerScan(preset)}
                      className={`flex-1 p-3 border rounded-lg text-xs transition-all hover:bg-cyber-lightGray/40 text-left ${
                        presetActive === preset.id 
                          ? 'border-cyber-cyan bg-cyber-cyan/5 text-white' 
                          : 'border-cyber-border/40 bg-cyber-gray/45 text-gray-400'
                      }`}
                    >
                      <div className="font-bold text-gray-300">{preset.title}</div>
                      <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Scan Results Details */}
        <div className="lg:col-span-1">
          {errorMsg && (
            <Card className="border-cyber-red border-t-4 bg-cyber-red/10 p-5 space-y-3 mb-6">
              <div className="flex items-center gap-2 text-cyber-red font-bold text-sm">
                <ShieldAlert className="w-5 h-5 animate-pulse" /> Connection Failed
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{errorMsg}</p>
            </Card>
          )}

          {result ? (
            <Card className="h-full flex flex-col justify-between">
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-cyber-border/40 pb-3">
                  {getRiskStyles(result.riskScore).icon}
                  <div>
                    <h3 className="font-bold text-white text-sm">QR Code Decoded</h3>
                    <p className={`text-xs font-bold font-mono ${getRiskStyles(result.riskScore).text}`}>
                      {result.riskScore >= 75 ? 'Dangerous Destination' : 'Suspicious Destination'}
                    </p>
                  </div>
                </div>

                {/* Target URL Info */}
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">Decoded Endpoint Link</h4>
                  <div className="flex items-center gap-1.5 p-2 bg-cyber-black/50 border border-cyber-border/40 rounded-lg text-xs font-mono text-gray-300 break-all">
                    <span>{result.decodedUrl}</span>
                  </div>
                </div>

                {/* Traced Redirect Chain */}
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Traced Redirect Chain</h4>
                  <div className="space-y-2 font-mono text-[10px] text-gray-400">
                    {result.redirects.map((red, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-cyber-lightGray border border-cyber-border text-gray-500 shrink-0 font-sans">
                          Step {idx + 1}
                        </span>
                        <span className="truncate">{red}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Reasons */}
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Risk Elements Identified</h4>
                  <ul className="space-y-2">
                    {result.reasons.map((reason, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2 leading-relaxed">
                        <span className="text-cyber-magenta select-none mt-0.5">✕</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Banner */}
              <div className="mt-8 border-t border-cyber-border/40 pt-4">
                <div className="bg-cyber-red/10 border border-cyber-red/30 p-3 rounded-lg text-xs">
                  <div className="font-semibold text-cyber-red flex items-center gap-1.5 mb-1">
                    ⚠️ Block Action Recommended
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    This QR link uses redirects to impersonate legitimate payment verification services. Do not click through or complete authentication overlays.
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            !errorMsg && (
              <Card className="h-full border-dashed border-cyber-border/60 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
                <div className="w-16 h-16 rounded-full bg-cyber-lightGray/50 border border-cyber-border/60 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                  <QrCode className="w-6 h-6 text-cyber-cyan" />
                </div>
                <h4 className="text-sm font-bold text-gray-300">Decoded Logs</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                  No active scan. Select a template on the left panel to scan the QR frame and trace its landing redirect tree.
                </p>
              </Card>
            )
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanVer {
          0% { top: 4%; opacity: 0.8; }
          50% { top: 96%; opacity: 0.8; }
          100% { top: 4%; opacity: 0.8; }
        }
      `}} />
    </div>
  );
}
