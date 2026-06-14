import React, { useState, useEffect } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { Key, Eye, EyeOff, ShieldAlert, CheckCircle2, User, Trash2 } from 'lucide-react';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [username, setUsername] = useState('Cyber Hunter');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('cybershield_gemini_key');
    if (savedKey) setApiKey(savedKey);

    const savedName = localStorage.getItem('cybershield_username');
    if (savedName) setUsername(savedName);
  }, []);

  const handleSave = () => {
    localStorage.setItem('cybershield_gemini_key', apiKey.trim());
    localStorage.setItem('cybershield_username', username.trim());
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleClearKey = () => {
    localStorage.removeItem('cybershield_gemini_key');
    setApiKey('');
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetStats = () => {
    if (window.confirm("Are you sure you want to clear all streaks, achievements, XP levels, and health scores? This action is permanent!")) {
      localStorage.clear();
      setApiKey('');
      setUsername('Cyber Hunter');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Settings & Privacy</h2>
        <p className="text-gray-400 text-sm mt-1">
          Customize your dashboard configurations and manage security keys in a privacy-first manner.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: General and Gemini config */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="space-y-6">
              {/* Profile Config */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-cyber-cyan" /> Profile Username
                </label>
                <input
                  type="text"
                  className="w-full bg-cyber-black/75 border border-cyber-border focus:border-cyber-cyan rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Cyber Defender"
                />
              </div>

              {/* Gemini API Key Config */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-cyber-purple" /> Gemini API Token (Optional)
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    className="w-full bg-cyber-black/75 border border-cyber-border focus:border-cyber-cyan rounded-lg py-3 pl-4 pr-12 text-sm text-gray-200 placeholder-gray-500 focus:outline-none transition-all font-mono"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-3.5 text-gray-500 hover:text-white"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Enter your Google Gemini API Key to enable live freeform AI chat mode in the simulator and dynamic message analyses. If empty, the app runs offline heuristics models.
                </p>
              </div>

              {/* Success Notification */}
              {saveSuccess && (
                <div className="p-3 bg-cyber-green/10 border border-cyber-green/30 text-cyber-green rounded-lg text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Configuration saved successfully.
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-cyber-border/30">
                <Button onClick={handleSave} className="text-xs">
                  Save Settings
                </Button>
                {apiKey && (
                  <Button variant="secondary" onClick={handleClearKey} className="text-xs">
                    Clear API Key
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Privacy Notice & Danger Zone */}
        <div className="lg:col-span-1 space-y-6">
          {/* Privacy advisory */}
          <Card className="border-l-4 border-l-cyber-cyan">
            <h4 className="text-[10px] uppercase font-bold text-cyber-cyan tracking-wider mb-2">Privacy-First Policy</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              CyberShield guarantees that all parsed text, URL strings, and screenshot image data are checked strictly inside your browser frame. No logs are exported to external databases, and local storage tokens never sync to remote hosts.
            </p>
          </Card>

          {/* Danger zone */}
          <Card className="border-t-4 border-t-cyber-red">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
              <ShieldAlert className="w-4 h-4 text-cyber-red" /> Danger Zone
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              Reset all statistics, achievements, local simulation scores, and stored API keys.
            </p>
            <Button variant="danger" className="w-full text-xs" onClick={handleResetStats}>
              <Trash2 className="w-4 h-4" /> Reset Local Stored Data
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
