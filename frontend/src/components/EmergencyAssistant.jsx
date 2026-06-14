import React, { useState } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { EMERGENCY_PLAYBOOKS } from '../utils/mockData';
import { ShieldAlert, Send, ArrowRight, CornerDownRight, CheckCircle2, RotateCcw } from 'lucide-react';

export default function EmergencyAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! I am your Cyber Emergency Assistant. If you have been targeted by a scam or suspect your accounts/devices are compromised, select one of the incident templates below or describe what happened in detail. I will help you contain and mitigate the threat immediately."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [activePlaybook, setActivePlaybook] = useState(null);
  const [completedSteps, setCompletedSteps] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSelectScenario = (key) => {
    const playbook = EMERGENCY_PLAYBOOKS[key];
    if (!playbook) return;

    // Add user message
    const userMsg = { sender: 'user', text: `Help! ${playbook.title}.` };
    // Add bot response
    const botMsg = {
      sender: 'bot',
      text: `Okay, don't panic. Understood that you clicked or encountered a: ${playbook.title}. I have initialized the Emergency containment protocol. Follow these steps in order to secure your device and accounts. Mark them off as you complete them:`,
      playbookKey: key
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setActivePlaybook(playbook);
    setCompletedSteps({});
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    const userMsg = { sender: 'user', text: userText, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      let response;
      try {
        response = await fetch('http://localhost:8000/emergency-copilot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userText })
        });
      } catch (err) {
        // Fallback relative path
        response = await fetch('/emergency-copilot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userText })
        });
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const botMsg = { 
        sender: 'bot', 
        text: data.analysis.reply, 
        time: new Date().toLocaleTimeString() 
      };
      setMessages((prev) => [...prev, botMsg]);

      if (data.analysis.steps && data.analysis.steps.length > 0) {
        const customPlaybook = {
          title: "AI Containment checklist",
          subtitle: data.analysis.reply,
          steps: data.analysis.steps
        };
        setActivePlaybook(customPlaybook);
        setCompletedSteps({});
      }
    } catch (err) {
      console.error(err);
      const botMsg = { 
        sender: 'bot', 
        text: "I experienced a connection issue, but here is immediate advice: Disconnect from Wi-Fi/data networks immediately. Do not share codes, credentials, or make payments. Change keys on another device.",
        time: new Date().toLocaleTimeString()
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const resetIncident = () => {
    setActivePlaybook(null);
    setCompletedSteps({});
    setMessages([
      {
        sender: 'bot',
        text: "Incident closed. I am ready to assist with any other emergency. Select a preset or describe your issue below."
      }
    ]);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Cyber Emergency Assistant</h2>
        <p className="text-gray-400 text-sm mt-1">
          Immediate incident response guides and checklist-containment playbooks to secure compromised devices and credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Conversational incident log */}
        <div className="lg:col-span-2 flex flex-col h-[520px] bg-cyber-gray/95 border border-cyber-border/40 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-cyber-black/80 border-b border-cyber-border/40 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-red dot-glow-red" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">Emergency Channel</span>
            </div>
            {activePlaybook && (
              <button
                onClick={resetIncident}
                className="text-xs text-cyber-cyan hover:underline flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset incident
              </button>
            )}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div 
                  className={`max-w-[85%] rounded-xl p-3.5 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyber-purple/20 border border-cyber-purple/40 text-white rounded-tr-none'
                      : 'bg-cyber-lightGray/70 border border-cyber-border/40 text-gray-300 rounded-tl-none font-sans'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* If the bot message matches a playbook trigger, render quick anchor buttons */}
                  {msg.sender === 'bot' && i === 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => handleSelectScenario('phishing_link')}
                        className="p-2 bg-cyber-black/50 border border-cyber-border/40 rounded text-left text-xs text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-all flex items-center justify-between"
                      >
                        <span>Clicked a link</span> <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSelectScenario('hacked_socials')}
                        className="p-2 bg-cyber-black/50 border border-cyber-border/40 rounded text-left text-xs text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-all flex items-center justify-between"
                      >
                        <span>Account hacked</span> <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleSelectScenario('malware_download')}
                        className="p-2 bg-cyber-black/50 border border-cyber-border/40 rounded text-left text-xs text-cyber-cyan hover:border-cyber-cyan hover:bg-cyber-cyan/5 transition-all flex items-center justify-between"
                      >
                        <span>Downloaded file</span> <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-cyber-lightGray/70 border border-cyber-border/40 rounded-xl rounded-tl-none p-3.5 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-cyber-black/80 border-t border-cyber-border/40 flex gap-2 shrink-0">
            <input
              type="text"
              className="flex-1 bg-cyber-gray border border-cyber-border/80 rounded-lg px-4 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-all"
              placeholder={loading ? "Generating checklist response..." : "Describe your cyber emergency here..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-2.5 bg-cyber-cyan text-cyber-black rounded-lg hover:shadow-glow-cyan active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Containment Checklist details */}
        <div className="lg:col-span-1">
          {activePlaybook ? (
            <Card className="h-full border-t-4 border-t-cyber-red flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-cyber-border/40 pb-3">
                  <ShieldAlert className="w-5 h-5 text-cyber-red" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Mitigation Playbook</h3>
                    <p className="text-[10px] text-gray-500 font-mono">{activePlaybook.title}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-gray-400">{activePlaybook.subtitle}</p>

                  <div className="space-y-3.5">
                    {activePlaybook.steps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`p-3 rounded-lg border transition-all ${
                          completedSteps[idx] 
                            ? 'border-cyber-green/30 bg-cyber-green/5 opacity-65' 
                            : 'border-cyber-border/40 bg-cyber-black/40'
                        }`}
                      >
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input 
                            type="checkbox"
                            className="mt-0.5 rounded border-cyber-border bg-cyber-black text-cyber-green focus:ring-cyber-green"
                            checked={!!completedSteps[idx]}
                            onChange={() => toggleStep(idx)}
                          />
                          <div className="text-xs">
                            <div className={`font-bold ${completedSteps[idx] ? 'text-cyber-green line-through' : 'text-white'}`}>
                              {step.title}
                            </div>
                            <p className="text-gray-400 mt-1 leading-relaxed text-[11px]">{step.detail}</p>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="border-t border-cyber-border/40 pt-4 mt-6">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                  <span>Containment Progress</span>
                  <span className="font-mono text-white">
                    {Object.values(completedSteps).filter(Boolean).length} / {activePlaybook.steps.length}
                  </span>
                </div>
                <div className="w-full bg-cyber-lightGray h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyber-green shadow-[0_0_8px_#10B981] transition-all duration-300"
                    style={{
                      width: `${(Object.values(completedSteps).filter(Boolean).length / activePlaybook.steps.length) * 100}%`
                    }}
                  />
                </div>
                {Object.values(completedSteps).filter(Boolean).length === activePlaybook.steps.length && (
                  <div className="text-[10px] text-cyber-green font-bold flex items-center gap-1 mt-2.5 animate-bounce">
                    <CheckCircle2 className="w-3.5 h-3.5" /> DEVICE SECURED. Containment successfully concluded.
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="h-full border-dashed border-cyber-border/60 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-cyber-lightGray/50 border border-cyber-border/60 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                <ShieldAlert className="w-6 h-6 text-cyber-red" />
              </div>
              <h4 className="text-sm font-bold text-gray-300">Playbook Standby</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                Choose an incident type or tell the assistant what happened to load step-by-step mitigation checkboxes.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
