import React, { useState, useEffect } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { Shield, ShieldAlert, Zap, Flame, Award, AlertOctagon, Terminal, ArrowRight, Activity } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const [healthScore, setHealthScore] = useState(68);
  const [streak, setStreak] = useState(5);
  const [scamsCaught, setScamsCaught] = useState(12);
  const [xp, setXp] = useState(450);

  // Sync state with localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem('cybershield_health_score');
    if (savedScore) setHealthScore(parseInt(savedScore, 10));

    const savedXp = localStorage.getItem('cybershield_xp');
    if (savedXp) setXp(parseInt(savedXp, 10));

    const savedScams = localStorage.getItem('cybershield_scams_detected');
    if (savedScams) setScamsCaught(parseInt(savedScams, 10));

    const savedStreak = localStorage.getItem('cybershield_streak');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
  }, []);

  const globalAlerts = [
    { id: 1, type: "Phishing", desc: "Fake Indian Post custom clearing SMS spoofing active.", time: "2m ago", severity: "High" },
    { id: 2, type: "OTP Theft", desc: "Real-time OTP relay targeting HDFC Cardholders discovered.", time: "15m ago", severity: "Critical" },
    { id: 3, type: "WhatsApp Scam", desc: "Fake family-in-distress UPI transfer requests trending.", time: "1h ago", severity: "Medium" },
    { id: 4, type: "Malware", desc: "PDF invoice attachment contains new keylogger payload.", time: "3h ago", severity: "High" },
  ];

  // Colors for dial based on score
  const getDialColor = (score) => {
    if (score >= 80) return 'text-cyber-green';
    if (score >= 50) return 'text-cyber-yellow';
    return 'text-cyber-red';
  };

  const getDialShadow = (score) => {
    if (score >= 80) return 'drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]';
    if (score >= 50) return 'drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]';
    return 'drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyber-gray to-cyber-lightGray border border-cyber-border/40 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-cyber-cyan/15 text-cyber-cyan rounded-md border border-cyber-cyan/30 animate-pulse-fast">
              System Protected
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans">
            Your Digital Shield is <span className="text-gradient-cyan-purple">Active</span>
          </h1>
          <p className="text-gray-400 max-w-lg text-sm">
            Analyze suspicious messages, verify domains, and train your social engineering reflexes. Privacy-first, always.
          </p>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="flex flex-wrap gap-4 justify-center z-10">
          <div className="bg-cyber-black/50 border border-cyber-border/40 px-5 py-3 rounded-xl flex items-center gap-3">
            <Flame className="w-6 h-6 text-cyber-magenta fill-cyber-magenta/20" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Daily Streak</div>
              <div className="text-lg font-bold text-white">{streak} Days</div>
            </div>
          </div>
          <div className="bg-cyber-black/50 border border-cyber-border/40 px-5 py-3 rounded-xl flex items-center gap-3">
            <Award className="w-6 h-6 text-cyber-purple" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Level {(Math.floor(xp / 100)) + 1}</div>
              <div className="text-lg font-bold text-white">{xp} XP</div>
            </div>
          </div>
        </div>
        
        {/* Decorative ambient elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-cyber-purple/5 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cyber Health Score Dial */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center relative overflow-hidden group">
          <h3 className="text-sm font-semibold text-gray-400 mb-6 uppercase tracking-wider flex items-center gap-1.5 self-start">
            <Activity className="w-4 h-4 text-cyber-cyan" /> Cyber Health Score
          </h3>
          
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Circle Dial */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                className="text-cyber-lightGray/80"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="6"
                className={`transition-all duration-1000 ease-out ${getDialColor(healthScore)} ${getDialShadow(healthScore)}`}
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * healthScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-black text-white font-sans">{healthScore}</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-gray-400">
              {healthScore >= 80 ? (
                <span className="text-cyber-green font-semibold">Your device protection is strong.</span>
              ) : healthScore >= 50 ? (
                <span className="text-cyber-yellow font-semibold">Decent shield, but room for critical improvements.</span>
              ) : (
                <span className="text-cyber-red font-semibold">High vulnerability risk detected!</span>
              )}
            </div>
            <button
              onClick={() => setActiveTab('health')}
              className="text-xs text-cyber-cyan hover:underline flex items-center gap-1 mx-auto mt-2"
            >
              Recalculate or view updates <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </Card>

        {/* Global Threat Feed */}
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-cyber-magenta" /> Live Threat Ticker
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyber-green dot-glow-green" /> Live Feed
            </span>
          </div>

          <div className="space-y-4 max-h-[170px] overflow-y-auto pr-2">
            {globalAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="flex items-start justify-between p-3 rounded-lg bg-cyber-lightGray/40 border border-cyber-border/30 hover:border-cyber-cyan/25 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded bg-cyber-black/60 border ${
                    alert.severity === 'Critical' ? 'border-cyber-red text-cyber-red' : 
                    alert.severity === 'High' ? 'border-cyber-yellow text-cyber-yellow' : 'border-cyber-cyan text-cyber-cyan'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-300">{alert.type}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{alert.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5 font-sans leading-relaxed">{alert.desc}</p>
                  </div>
                </div>
                <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${
                  alert.severity === 'Critical' ? 'bg-cyber-red/10 border-cyber-red text-cyber-red' :
                  alert.severity === 'High' ? 'bg-cyber-yellow/10 border-cyber-yellow text-cyber-yellow' : 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Core Navigation Cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-1.5">
          <Terminal className="w-4 h-4 text-cyber-purple" /> Threat Detection Hub
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col justify-between h-48 border-l-4 border-l-cyber-cyan">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Message Analyzer</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Scan SMS, Emails, WhatsApp messages, or copy-pasted social media posts for credential requests and social engineering lures.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs" onClick={() => setActiveTab('message')}>
              Analyze Message <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          <Card className="flex flex-col justify-between h-48 border-l-4 border-l-cyber-purple">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">URL Safety Scanner</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Check domain reputation, registration dates, certificate authorities, and detect redirects before visiting suspicious links.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs" onClick={() => setActiveTab('url')}>
              Scan Link <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          <Card className="flex flex-col justify-between h-48 border-l-4 border-l-cyber-magenta">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Screenshot Phishing</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Upload image screenshots of suspect login pages, invoices, or emails to detect visual brand discrepancies and bad CTA indicators.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs" onClick={() => setActiveTab('screenshot')}>
              Detect Phishing <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          <Card className="flex flex-col justify-between h-48 border-l-4 border-l-cyber-green">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">QR Code Scanner</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Decode QR codes safely. Verify destination addresses, domain ages, and trace redirects before opening target browser targets.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs" onClick={() => setActiveTab('qrcode')}>
              Verify QR Code <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          {/* FLAGSHIP SCAM SIMULATOR */}
          <Card className="flex flex-col justify-between h-48 border-l-4 border-l-cyber-yellow relative overflow-hidden group">
            <div className="absolute right-3 top-3 w-12 h-12 bg-cyber-yellow/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
              <Zap className="w-5 h-5 text-cyber-yellow animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <h4 className="text-lg font-bold text-white">AI Scam Simulator</h4>
                <span className="text-[9px] px-1.5 py-0.5 bg-cyber-yellow/20 border border-cyber-yellow text-cyber-yellow uppercase font-bold rounded">
                  Flagship
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Learn social engineering by doing. Participate in multiple-choice scenarios or chat live with AI scammers in a sandbox environment.
              </p>
            </div>
            <Button variant="primary" className="w-full mt-4 text-xs" onClick={() => setActiveTab('simulator')}>
              Enter Sandbox <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          <Card className="flex flex-col justify-between h-48 border-l-4 border-l-cyber-red">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Emergency Assistant</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Just clicked a phishing link or shared credentials? Launch the assistant for personalized instant response playbooks.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-4 text-xs" onClick={() => setActiveTab('emergency')}>
              Incident Response <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
