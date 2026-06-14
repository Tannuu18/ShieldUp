import React, { useState, useEffect } from 'react';
import Dashboard from './utils/components/Dashboard.jsx';
import MessageAnalyzer from './utils/components/MessageAnalyzer.jsx';
import URLScanner from './utils/components/URLScanner.jsx';
import ScreenshotDetector from './utils/components/ScreenshotDetector.jsx';
import QRCodeScanner from './utils/components/QRCodeScanner.jsx';
import EmergencyAssistant from './utils/components/EmergencyAssistant.jsx';
import HealthAdvisor from './utils/components/HealthAdvisor.jsx';
import ScamSimulator from './utils/components/ScamSimulator.jsx';
import Achievements from './utils/components/Achievements.jsx';
import Settings from './utils/components/Settings.jsx';
import GlowEffect from './utils/components/Shared/GlowEffect.jsx';
import { 
  Shield, LayoutDashboard, Terminal, Globe, Camera, 
  QrCode, ShieldAlert, Activity, Gamepad2, Award, 
  Settings as SettingsIcon, Menu, X, Flame 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Stored state updates
  const [xp, setXp] = useState(450);
  const [streak, setStreak] = useState(5);
  const [username, setUsername] = useState('Cyber Hunter');

  // Trigger sync on tab changes/renders
  useEffect(() => {
    const savedXp = localStorage.getItem('cybershield_xp');
    if (savedXp) setXp(parseInt(savedXp, 10));

    const savedStreak = localStorage.getItem('cybershield_streak');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    const savedName = localStorage.getItem('cybershield_username');
    if (savedName) setUsername(savedName);
  }, [activeTab]);

  const level = Math.floor(xp / 100) + 1;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'message', label: 'Message Analyzer', icon: <Terminal className="w-4 h-4" /> },
    { id: 'url', label: 'URL Scanner', icon: <Globe className="w-4 h-4" /> },
    { id: 'screenshot', label: 'Screenshot Phishing', icon: <Camera className="w-4 h-4" /> },
    { id: 'qrcode', label: 'QR Code Scanner', icon: <QrCode className="w-4 h-4" /> },
    { id: 'emergency', label: 'Emergency Copilot', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'health', label: 'Security Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'simulator', label: 'Scam Simulator', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'message':
        return <MessageAnalyzer />;
      case 'url':
        return <URLScanner />;
      case 'screenshot':
        return <ScreenshotDetector />;
      case 'qrcode':
        return <QRCodeScanner />;
      case 'emergency':
        return <EmergencyAssistant />;
      case 'health':
        return <HealthAdvisor />;
      case 'simulator':
        return <ScamSimulator />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-gray-300 font-sans flex relative overflow-hidden">
      {/* Background Glow Decors */}
      <GlowEffect color="purple" className="-left-44 -top-44 w-[600px] h-[600px] opacity-45" />
      <GlowEffect color="cyan" className="-right-44 -bottom-44 w-[600px] h-[600px] opacity-45" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-cyber-gray/95 border-r border-cyber-border/40 shrink-0 z-35 backdrop-blur-md">
        {/* Brand header */}
        <div className="p-6 border-b border-cyber-border/40 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyber-cyan to-cyber-purple flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            <Shield className="w-5 h-5 text-cyber-black" />
          </div>
          <div>
            <h1 className="text-md font-extrabold tracking-wider text-white font-sans uppercase m-0 leading-none">
              ShieldUp
            </h1>
            <span className="text-[9px] font-mono text-cyber-cyan block mt-1">Privacy-First AI</span>
          </div>
        </div>

        {/* Menu list */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-purple/5 border-l-4 border-l-cyber-cyan text-white shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                    : 'text-gray-400 hover:text-white hover:bg-cyber-lightGray/30 border-l-4 border-l-transparent'
                }`}
              >
                <span className={isActive ? 'text-cyber-cyan' : 'text-gray-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Footer profile sync */}
        <div className="p-4 border-t border-cyber-border/40 bg-cyber-dark/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-cyber-lightGray border border-cyber-border flex items-center justify-center text-sm font-bold text-white uppercase shrink-0 select-none">
              {username[0]}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate leading-none">{username}</div>
              <span className="text-[10px] text-gray-500 font-mono">Lvl {level}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-cyber-magenta ml-2">
            <Flame className="w-4 h-4 fill-cyber-magenta/15" />
            <span className="text-xs font-bold font-mono">{streak}d</span>
          </div>
        </div>
      </aside>

      {/* Mobile Header Nav */}
      <div className="flex flex-col flex-1 w-full max-w-full z-20">
        <header className="lg:hidden flex items-center justify-between p-4 bg-cyber-gray/90 border-b border-cyber-border/40 backdrop-blur-md z-30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyber-cyan to-cyber-purple flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-cyber-black" />
            </div>
            <h1 className="text-sm font-extrabold tracking-wider text-white uppercase m-0 leading-none">
              CyberShield
            </h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 border border-cyber-border rounded hover:bg-cyber-lightGray/40 text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile menu drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-cyber-black/90 z-25 flex flex-col pt-16 animate-fadeIn">
            <nav className="flex-1 px-6 py-6 space-y-2.5 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                      isActive
                        ? 'border-cyber-cyan/50 bg-cyber-cyan/5 text-white'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
            <div className="p-6 border-t border-cyber-border/40 flex justify-between items-center bg-cyber-dark/65">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyber-lightGray border border-cyber-border flex items-center justify-center text-sm font-bold text-white uppercase">
                  {username[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-none">{username}</div>
                  <span className="text-[10px] text-gray-500 font-mono">Lvl {level}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-cyber-magenta">
                <Flame className="w-4 h-4 fill-cyber-magenta/15" />
                <span className="text-xs font-bold font-mono">{streak}d</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Frame */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          <div className="max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
