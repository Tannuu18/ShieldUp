import React, { useState } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { SCREENSHOT_TEMPLATES } from '../utils/mockData';
import { Camera, ShieldAlert, Zap, AlertTriangle, Eye, Sparkles } from 'lucide-react';

export default function ScreenshotDetector() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const startScan = async () => {
    if (!selectedTemplate) return;
    setScanning(true);
    setScanned(false);
    setActiveHotspot(null);

    // Simulate scanning laser animation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setScanning(false);
    setScanned(true);

    const totalScams = parseInt(localStorage.getItem('cybershield_scams_detected') || '0', 10);
    localStorage.setItem('cybershield_scams_detected', (totalScams + 1).toString());
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Load first template as mock upload
      setSelectedTemplate(SCREENSHOT_TEMPLATES[0]);
      setScanned(false);
      setScanning(false);
    }
  };

  const loadTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    setScanned(false);
    setScanning(false);
    setActiveHotspot(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Screenshot Phishing Detector</h2>
        <p className="text-gray-400 text-sm mt-1">
          Upload screenshots of login portals, receipts, or emails. AI inspects alignment, logo spoofing, and link targets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Mock Upload & Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedTemplate ? (
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center flex flex-col items-center justify-center min-h-[350px] transition-all ${
                dragActive 
                  ? 'border-cyber-cyan bg-cyber-cyan/5' 
                  : 'border-cyber-border bg-cyber-gray/50'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-cyber-lightGray border border-cyber-border flex items-center justify-center text-gray-400 mb-4">
                <Camera className="w-6 h-6 text-cyber-cyan" />
              </div>
              <h3 className="text-md font-bold text-white">Upload Phishing Screenshot</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-2">
                Drag and drop your image, or click to browse. Supports PNG, JPG (Max 5MB).
              </p>
              
              <div className="mt-6 flex flex-col items-center">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Or select a demo template below</span>
                <div className="flex flex-wrap gap-2.5 justify-center">
                  {SCREENSHOT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => loadTemplate(tmpl)}
                      className="px-3 py-1.5 border border-cyber-border bg-cyber-black text-xs text-gray-300 rounded hover:border-cyber-purple hover:text-white transition-all font-mono"
                    >
                      {tmpl.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Template loaded work area */
            <Card className="relative overflow-hidden p-4 select-none">
              {/* Toolbar */}
              <div className="flex justify-between items-center pb-3 border-b border-cyber-border/40 mb-4">
                <div className="text-xs text-gray-400 font-mono">
                  Target: <span className="text-white">{selectedTemplate.title}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" className="py-1 px-3 text-xs" onClick={() => setSelectedTemplate(null)}>
                    Reset
                  </Button>
                  <Button 
                    variant="primary" 
                    className="py-1 px-3 text-xs" 
                    onClick={startScan} 
                    loading={scanning}
                    disabled={scanning}
                  >
                    Run Vision Audit
                  </Button>
                </div>
              </div>

              {/* Rendering of target HTML representing a screenshot in the sandbox */}
              <div className="relative border border-cyber-border/60 rounded-lg overflow-hidden bg-cyber-black/90 p-6 min-h-[300px] flex items-center justify-center">
                {/* HTML content rendering the fake page */}
                <div 
                  className="w-full opacity-90 transition-opacity duration-300"
                  dangerouslySetInnerHTML={{ __html: selectedTemplate.bodyHtml }}
                />

                {/* Laser scan animation line */}
                {scanning && (
                  <div className="absolute left-0 right-0 h-1 bg-cyber-cyan shadow-[0_0_15px_#00F0FF] animate-[scan_2s_linear_infinite]" 
                       style={{
                         animation: 'scan 2s linear infinite',
                         backgroundImage: 'linear-gradient(90deg, transparent, #00F0FF, transparent)'
                       }}
                  />
                )}

                {/* Scanned hotspots overlays */}
                {scanned && selectedTemplate.hotspots.map((hotspot) => (
                  <button
                    key={hotspot.id}
                    className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-300 animate-pulse ${
                      activeHotspot?.id === hotspot.id
                        ? 'border-cyber-magenta bg-cyber-magenta/15 shadow-[0_0_12px_#FF007F] scale-105 z-20'
                        : 'border-cyber-red bg-cyber-red/10 hover:bg-cyber-red/20 shadow-[0_0_8px_#EF4444] z-10'
                    }`}
                    style={{
                      top: hotspot.top,
                      left: hotspot.left,
                      width: hotspot.width,
                      height: hotspot.height,
                    }}
                    onClick={() => setActiveHotspot(hotspot)}
                    aria-label={`Highlight element: ${hotspot.title}`}
                  />
                ))}
              </div>
              
              {scanned && (
                <div className="text-[10px] text-gray-500 mt-2 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyber-cyan" /> Hover or tap the highlighted red blocks to reveal security details.
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right Side: Analysis Findings popover */}
        <div className="lg:col-span-1">
          {scanning ? (
            <Card className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
              <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
              <h4 className="text-sm font-bold text-gray-300">Scanning Image Structure</h4>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Inspecting style headers, certificate alignment, trademark text spacing, and destination anchors...
              </p>
            </Card>
          ) : scanned ? (
            <Card className="h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-cyber-border/40 pb-3">
                  <ShieldAlert className="w-5 h-5 text-cyber-red" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Vision Audit Report</h3>
                    <p className="text-[10px] text-gray-500 font-mono">Found {selectedTemplate.hotspots.length} Critical Risks</p>
                  </div>
                </div>

                {activeHotspot ? (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${
                        activeHotspot.risk === 'Critical' ? 'bg-cyber-red/25 text-cyber-red border border-cyber-red/40' : 'bg-cyber-yellow/25 text-cyber-yellow border border-cyber-yellow/40'
                      }`}>
                        {activeHotspot.risk}
                      </span>
                      <h4 className="text-sm font-bold text-white">{activeHotspot.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {activeHotspot.description}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 text-center py-8">
                    <div className="w-12 h-12 bg-cyber-lightGray rounded-full flex items-center justify-center text-gray-400 mx-auto">
                      <Eye className="w-5 h-5 text-cyber-cyan" />
                    </div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase">Select Highlight Block</h4>
                    <p className="text-xs text-gray-500 max-w-[200px] mx-auto leading-relaxed">
                      Tap any bounding-box on the screenshot container to see the audit details.
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar statistics list */}
              <div className="mt-8 border-t border-cyber-border/40 pt-4">
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Impersonation Findings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs p-2 bg-cyber-black/45 rounded border border-cyber-border/30">
                    <span className="text-gray-400">Brand Mimicry</span>
                    <span className="text-cyber-red font-semibold font-mono">Spoofed</span>
                  </div>
                  <div className="flex justify-between items-center text-xs p-2 bg-cyber-black/45 rounded border border-cyber-border/30">
                    <span className="text-gray-400">Urgency Lures</span>
                    <span className="text-cyber-yellow font-semibold font-mono">Detected</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full border-dashed border-cyber-border/60 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-cyber-lightGray/50 border border-cyber-border/60 flex items-center justify-center text-gray-500 mb-4">
                <Sparkles className="w-6 h-6 text-cyber-cyan animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-gray-300">Scanner Waiting</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                Select one of the demo phishing templates on the left workspace, then click &apos;Run Vision Audit&apos; to process visual threats.
              </p>
            </Card>
          )}
        </div>
      </div>
      
      {/* Laser Scanning Animation Keyframes Inject */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
      `}} />
    </div>
  );
}
