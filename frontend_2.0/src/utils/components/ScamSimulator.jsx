import React, { useState, useEffect } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { SIMULATOR_SCENARIOS, CHAT_SCENARIOS } from '../mockData';
import { generateScammerResponse } from '../gemini';
import { Award, Zap, ShieldAlert, CheckCircle, BrainCircuit, MessageSquare, AlertTriangle, Send, RefreshCw } from 'lucide-react';

export default function ScamSimulator() {
  const [activeMode, setActiveMode] = useState(null); // 'trainer' or 'chat'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Mode A: Trainer State
  const [clickedWords, setClickedWords] = useState([]);
  const [userChoice, setUserChoice] = useState('');
  const [trainerChecked, setTrainerChecked] = useState(false);
  
  // Mode B: Chat State
  const [chatHistory, setChatHistory] = useState([]);
  const [currentStateKey, setCurrentStateKey] = useState('start');
  const [isTyping, setIsTyping] = useState(false);
  const [chatReport, setChatReport] = useState(null);
  const [freeformMode, setFreeformMode] = useState(false);
  const [freeformInput, setFreeformInput] = useState('');
  const [freeformLoading, setFreeformLoading] = useState(false);

  // Sync achievements/XP helper
  const addXP = (amount) => {
    const currentXp = parseInt(localStorage.getItem('cybershield_xp') || '0', 10);
    const newXp = currentXp + amount;
    localStorage.setItem('cybershield_xp', newXp.toString());
    
    // Increment streak
    const currentStreak = parseInt(localStorage.getItem('cybershield_streak') || '0', 10);
    if (currentStreak === 0) {
      localStorage.setItem('cybershield_streak', '1');
    }
  };

  // --- TRAINER MODE (MODE A) ---
  const handleTrainerWordClick = (wordText, hotspot) => {
    if (trainerChecked) return;
    
    // Toggle clicked word
    if (clickedWords.some(w => w.text === wordText)) {
      setClickedWords(prev => prev.filter(w => w.text !== wordText));
    } else {
      setClickedWords(prev => [...prev, { text: wordText, hotspot }]);
    }
  };

  const handleTrainerSubmit = () => {
    if (!userChoice) return;
    setTrainerChecked(true);

    const isCorrect = userChoice === selectedItem.correctChoice;
    if (isCorrect) {
      // Find how many correct hotspots were identified
      const scoreWeight = clickedWords.filter(w => w.hotspot !== undefined).length;
      addXP(50 + (scoreWeight * 10));
    } else {
      addXP(10); // pity XP
    }
  };

  const renderHighlightedMessage = () => {
    let html = selectedItem.messageText;
    
    // Create clickable spans for hotspots
    selectedItem.hotspots.forEach((hs) => {
      const escaped = hs.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'g');
      
      const isClicked = clickedWords.some(w => w.text === hs.text);
      const highlightClass = isClicked 
        ? 'bg-cyber-yellow/20 border-b border-cyber-yellow text-white font-medium cursor-pointer px-1 rounded' 
        : 'hover:bg-cyber-lightGray/40 border-b border-dashed border-gray-600 cursor-pointer px-1 rounded transition-colors';
      
      html = html.replace(regex, `<span class="${highlightClass}" data-hotspot-text="${hs.text}">${hs.text}</span>`);
    });

    // Replace linebreaks with HTML br tags
    const formatted = html.split('\n').join('<br />');

    return (
      <div 
        className="p-5 bg-cyber-black/70 border border-cyber-border rounded-xl font-mono text-sm leading-relaxed text-gray-300 select-none whitespace-pre-wrap"
        onClick={(e) => {
          const target = e.target;
          const hotspotText = target.getAttribute('data-hotspot-text');
          if (hotspotText) {
            const hs = selectedItem.hotspots.find(h => h.text === hotspotText);
            handleTrainerWordClick(hotspotText, hs);
          }
        }}
        dangerouslySetInnerHTML={{ __html: formatted }}
      />
    );
  };


  // --- CHAT MODE (MODE B) ---
  const startChatScenario = (scen) => {
    setSelectedItem(scen);
    setChatReport(null);
    setChatHistory([{ sender: 'bot', text: scen.initialMsg, time: new Date().toLocaleTimeString() }]);
    setCurrentStateKey('start');
    
    // Check if freeform AI chat mode is available via Gemini API key
    const apiKey = localStorage.getItem('cybershield_gemini_key');
    if (apiKey) {
      setFreeformMode(true);
    } else {
      setFreeformMode(false);
    }
  };

  const handleChatOptionClick = (option) => {
    if (isTyping) return;

    // Add user response
    const userMsg = { sender: 'user', text: option.text, time: new Date().toLocaleTimeString() };
    const historyWithUser = [...chatHistory, userMsg];
    setChatHistory(historyWithUser);
    setIsTyping(true);

    const nextKey = option.nextState;

    setTimeout(() => {
      const scenarioData = selectedItem.dialogFlow[nextKey];
      
      if (scenarioData) {
        const botMsg = { sender: 'bot', text: scenarioData.botReply, time: new Date().toLocaleTimeString() };
        setChatHistory(prev => [...prev, botMsg]);
        setCurrentStateKey(nextKey);
        setIsTyping(false);

        // Check if game end state
        if (scenarioData.isEnd) {
          endChatSimulation(scenarioData);
        }
      }
    }, 1000);
  };

  const handleFreeformSubmit = async (e) => {
    e.preventDefault();
    if (!freeformInput.trim() || freeformLoading) return;

    const userText = freeformInput.trim();
    setFreeformInput('');
    
    const userMsg = { sender: 'user', text: userText, time: new Date().toLocaleTimeString() };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setFreeformLoading(true);

    try {
      const apiKey = localStorage.getItem('cybershield_gemini_key');
      
      // Map history format to standard for prompt helper
      const apiHistory = updatedHistory.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const aiResponse = await generateScammerResponse(apiHistory, apiKey);
      
      const botMsg = {
        sender: 'bot',
        text: aiResponse.reply,
        time: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, botMsg]);

      if (aiResponse.isEnd) {
        endChatSimulation({
          rating: aiResponse.rating || "Vulnerable",
          tacticsIdentified: aiResponse.tactics || ["Social manipulation"],
          xpEarned: aiResponse.rating === "Exposed" ? 100 : 10
        });
      }
    } catch (err) {
      console.error(err);
      // Fallback response
      setChatHistory(prev => [...prev, {
        sender: 'bot',
        text: "Uh... connection issues on my side. I must go. (Simulation ended due to API error.)",
        time: new Date().toLocaleTimeString()
      }]);
      setFreeformMode(false);
    }
    setFreeformLoading(false);
  };

  const handleFreeformPanic = () => {
    // Expose the scammer
    endChatSimulation({
      rating: "Scam Hunter",
      tacticsIdentified: selectedItem.techniques || ["Phishing Lure", "Authority Pressure"],
      xpEarned: 100
    });
  };

  const endChatSimulation = (endData) => {
    setChatReport(endData);
    addXP(endData.xpEarned);
    
    // Save statistic increment
    if (endData.rating !== 'Vulnerable') {
      const savedCount = parseInt(localStorage.getItem('cybershield_scams_detected') || '0', 10);
      localStorage.setItem('cybershield_scams_detected', (savedCount + 1).toString());
    }
  };

  const resetAll = () => {
    setSelectedItem(null);
    setClickedWords([]);
    setUserChoice('');
    setTrainerChecked(false);
    setChatHistory([]);
    setChatReport(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-extrabold text-white">AI Scam Simulator</h2>
          <p className="text-gray-400 text-sm mt-1">
            Duolingo-style sandbox training. Spot social engineering tricks in messages or chat live with adversarial scammers.
          </p>
        </div>
        {(activeMode || selectedItem) && (
          <Button variant="outline" className="text-xs py-1.5 px-3" onClick={() => { setActiveMode(null); resetAll(); }}>
            Exit Sandbox
          </Button>
        )}
      </div>

      {!activeMode ? (
        /* MODE SELECTION PANEL */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="flex flex-col justify-between border border-cyber-cyan/25 hover:border-cyber-cyan/60 hover:shadow-glow-cyan h-64 p-8 relative overflow-hidden group">
            <div className="absolute right-6 top-6 w-14 h-14 bg-cyber-cyan/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
              <BrainCircuit className="w-7 h-7 text-cyber-cyan" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyber-cyan">Scenario Spotting</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Duolingo Scenario Trainer</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                Spot red flags (urgency, spoof links, verify requests) inside realistic scam message mockups.
              </p>
            </div>
            <Button variant="primary" className="w-full text-xs" onClick={() => setActiveMode('trainer')}>
              Start Scenario Training
            </Button>
          </Card>

          <Card className="flex flex-col justify-between border border-cyber-purple/25 hover:border-cyber-purple/60 hover:shadow-glow-purple h-64 p-8 relative overflow-hidden group">
            <div className="absolute right-6 top-6 w-14 h-14 bg-cyber-purple/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
              <MessageSquare className="w-7 h-7 text-cyber-purple" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyber-purple">Active Evasion Roleplay</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Adversary Chat Simulator</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                Chat live with automated bank agents or refund reps. Avoid sharing OTPs or downloading remote sharing tools.
              </p>
            </div>
            <Button variant="secondary" className="w-full text-xs hover:border-cyber-purple/50" onClick={() => setActiveMode('chat')}>
              Enter Scammer Chat
            </Button>
          </Card>
        </div>
      ) : activeMode === 'trainer' && !selectedItem ? (
        /* MODE A: LEVEL SELECTION */
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Scenario Level</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SIMULATOR_SCENARIOS.map((scen) => (
              <Card key={scen.id} className="hover:border-cyber-cyan/40 cursor-pointer" onClick={() => setSelectedItem(scen)}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] px-1.5 py-0.5 bg-cyber-cyan/15 border border-cyber-cyan/30 text-cyber-cyan rounded font-mono uppercase font-bold">
                      {scen.type}
                    </span>
                    <h4 className="text-md font-bold text-white mt-2">{scen.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {scen.introText}
                    </p>
                  </div>
                  <Zap className="w-5 h-5 text-cyber-yellow shrink-0 ml-4" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : activeMode === 'trainer' && selectedItem ? (
        /* MODE A: GAME INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="space-y-4">
                <div className="text-xs text-gray-500 font-mono">
                  Task: Tap the lines or words that trigger Red Flags, then make your decision.
                </div>
                {renderHighlightedMessage()}
                
                {/* Decision choices */}
                {!trainerChecked && (
                  <div className="flex gap-3 justify-center pt-4 border-t border-cyber-border/40">
                    {selectedItem.choices.map((ch) => (
                      <button
                        key={ch}
                        onClick={() => setUserChoice(ch)}
                        className={`px-5 py-2.5 rounded-lg border text-sm font-bold transition-all ${
                          userChoice === ch 
                            ? 'border-cyber-cyan bg-cyber-cyan/15 text-white' 
                            : 'border-cyber-border/40 bg-cyber-black/45 text-gray-400'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  {!trainerChecked ? (
                    <Button onClick={handleTrainerSubmit} disabled={!userChoice}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button onClick={resetAll} variant="outline">
                      Next Level
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Red flag analysis explanation */}
            {trainerChecked && (
              <Card className={`border-t-4 ${userChoice === selectedItem.correctChoice ? 'border-t-cyber-green' : 'border-t-cyber-red'} animate-fadeIn`}>
                <div className="flex items-start gap-3 mb-4">
                  {userChoice === selectedItem.correctChoice ? (
                    <CheckCircle className="w-5 h-5 text-cyber-green shrink-0 mt-0.5" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-cyber-red shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {userChoice === selectedItem.correctChoice ? 'Correct Answer! (+50 XP)' : 'Incorrect Classification! (+10 XP)'}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      This is classified as a <span className="font-bold text-white uppercase">{selectedItem.correctChoice}</span>.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed bg-cyber-black/40 border border-cyber-border/30 p-3 rounded-lg font-sans">
                  {selectedItem.redFlagsExplanation}
                </p>
              </Card>
            )}
          </div>

          {/* Right Panel: Red flag list detailed */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-4 border-b border-cyber-border/40 pb-2 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-cyber-cyan" /> Red Flags Spotter
                </h4>
                
                <div className="space-y-4">
                  {clickedWords.length > 0 ? (
                    <div className="space-y-3">
                      {clickedWords.map((word, idx) => (
                        <div key={idx} className="p-3 bg-cyber-yellow/5 border border-cyber-yellow/20 rounded-lg animate-fadeIn">
                          <div className="text-[10px] font-bold text-cyber-yellow uppercase tracking-wider">
                            {word.hotspot ? word.hotspot.label : "Generic Text Flagged"}
                          </div>
                          <div className="text-xs font-semibold text-white mt-1 font-mono">
                            &quot;{word.text}&quot;
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed font-sans">
                            {word.hotspot ? word.hotspot.explanation : "You highlighted this text. Think: why might this prompt credential sharing or urgency pressures?"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500 text-xs leading-relaxed max-w-[180px] mx-auto space-y-2.5">
                      <Zap className="w-8 h-8 text-cyber-border mx-auto animate-bounce" />
                      <div>Tap suspect words or sentences in the message panel to reveal cybersecurity explanations.</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary score ticker */}
              {trainerChecked && (
                <div className="mt-6 pt-4 border-t border-cyber-border/40 text-[10px] text-gray-500 font-mono">
                  Spotting accuracy: {clickedWords.filter(w => w.hotspot !== undefined).length} / {selectedItem.hotspots.length} major indicators.
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : activeMode === 'chat' && !selectedItem ? (
        /* MODE B: ADVERSARY SELECTION */
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Scammer Adversary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(CHAT_SCENARIOS).map((key) => {
              const item = CHAT_SCENARIOS[key];
              return (
                <Card key={key} className="hover:border-cyber-purple/40 cursor-pointer" onClick={() => startChatScenario(item)}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl bg-cyber-lightGray border border-cyber-border/40 w-16 h-16 rounded-full flex items-center justify-center shrink-0">
                      {item.avatar}
                    </span>
                    <div>
                      <h4 className="text-md font-bold text-white">{item.character}</h4>
                      <div className="flex gap-1.5 mt-1.5 flex-wrap">
                        {item.techniques.map((tech, i) => (
                          <span key={i} className="text-[9px] px-1.5 py-0.5 bg-cyber-purple/15 border border-cyber-purple/30 text-cyber-purple rounded font-mono uppercase font-bold">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* MODE B: GAME INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Window Panel */}
          <div className="lg:col-span-2 flex flex-col h-[520px] bg-cyber-gray/95 border border-cyber-border/40 rounded-xl overflow-hidden">
            {/* Header banner */}
            <div className="p-4 bg-cyber-black/80 border-b border-cyber-border/40 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedItem.avatar}</span>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none">{selectedItem.character}</h4>
                  <span className="text-[10px] text-gray-500 font-mono mt-1 block">Active Threat Connection</span>
                </div>
              </div>
              {freeformMode && !chatReport && (
                <button
                  onClick={handleFreeformPanic}
                  className="px-3 py-1 bg-cyber-red/20 border border-cyber-red text-cyber-red text-xs rounded hover:bg-cyber-red hover:text-white transition-all font-mono font-bold"
                >
                  Report Scam 🚨
                </button>
              )}
            </div>

            {/* Dialogue Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  <div className={`max-w-[80%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    chat.sender === 'user'
                      ? 'bg-cyber-purple/20 border border-cyber-purple/40 text-white rounded-tr-none'
                      : 'bg-cyber-lightGray/70 border border-cyber-border/40 text-gray-300 rounded-tl-none font-mono'
                  }`}>
                    {chat.text}
                    <div className="text-[9px] text-gray-500 mt-1.5 text-right select-none">{chat.time}</div>
                  </div>
                </div>
              ))}
              
              {(isTyping || freeformLoading) && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-cyber-lightGray/60 border border-cyber-border/30 rounded-xl rounded-tl-none p-3.5 flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-purple animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input Selection / Freeform box */}
            <div className="p-4 bg-cyber-black/80 border-t border-cyber-border/40 shrink-0">
              {chatReport ? (
                <div className="text-center py-2">
                  <Button onClick={resetAll} variant="outline" className="text-xs mx-auto">
                    Return to Selection
                  </Button>
                </div>
              ) : freeformMode ? (
                <form onSubmit={handleFreeformSubmit} className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-cyber-gray border border-cyber-border/80 rounded-lg px-4 py-2.5 text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyber-cyan transition-all"
                    placeholder="Type your reply to the scammer here..."
                    value={freeformInput}
                    onChange={(e) => setFreeformInput(e.target.value)}
                    disabled={freeformLoading}
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-cyber-cyan text-cyber-black rounded-lg hover:shadow-glow-cyan active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    disabled={!freeformInput.trim() || freeformLoading}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* MULTIPLE CHOICE DIALOG STATE OPTIONS */
                <div className="space-y-2.5">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono mb-1.5">Choose your reply:</div>
                  <div className="flex flex-col gap-2">
                    {selectedItem.dialogFlow[currentStateKey]?.options?.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleChatOptionClick(opt)}
                        className="w-full text-left p-3 bg-cyber-gray border border-cyber-border/40 hover:border-cyber-purple/50 rounded-lg text-xs text-gray-300 hover:text-white transition-all flex items-center gap-2"
                      >
                        <span className="text-cyber-purple font-mono font-bold select-none">&gt;</span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Post-game breakdown */}
          <div className="lg:col-span-1 animate-fadeIn">
            {chatReport ? (
              <Card className={`h-full border-t-4 ${
                chatReport.rating === 'Vulnerable' ? 'border-t-cyber-red' : 'border-t-cyber-green'
              } flex flex-col justify-between`}>
                <div className="space-y-6">
                  {/* Dial Indicator */}
                  <div className="text-center py-4 border-b border-cyber-border/40 pb-5">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Simulated Standing</div>
                    <div className={`text-2xl font-black ${
                      chatReport.rating === 'Vulnerable' ? 'text-cyber-red' : 'text-cyber-green'
                    }`}>
                      {chatReport.rating}
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 mt-1.5 block">
                      XP Awarded: <span className="text-white">+{chatReport.xpEarned} XP</span>
                    </span>
                  </div>

                  {/* Manipulations identified */}
                  <div>
                    <h4 className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2">Manipulation Techniques Traced</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {chatReport.tacticsIdentified.map((tactic, idx) => (
                        <span key={idx} className="text-[10px] font-mono border border-cyber-border/60 bg-cyber-black px-2.5 py-1 rounded text-gray-300">
                          ✓ {tactic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Warning Rationale */}
                  <div className="p-3 bg-cyber-black/40 border border-cyber-border/30 rounded-lg text-xs leading-relaxed text-gray-400">
                    <div className="font-semibold text-white flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-cyber-yellow" /> Simulator Warning
                    </div>
                    {chatReport.rating === 'Vulnerable' ? (
                      "You fell for a verification link or a remote login download trap. Attackers use authority names to bypass rational warnings. Never share keys or run remote desk packages on call instructions."
                    ) : (
                      "Success! You spotted the OTP relay or Remote Access request and cut the caller off. Banks and official firms will never request codes or screen sharing applications."
                    )}
                  </div>
                </div>

                <div className="border-t border-cyber-border/40 pt-4 mt-6">
                  <Button variant="outline" className="w-full text-xs" onClick={resetAll}>
                    Try Another Adversary
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="h-full border-dashed border-cyber-border/60 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
                <div className="w-16 h-16 rounded-full bg-cyber-lightGray/50 border border-cyber-border/60 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                  <MessageSquare className="w-6 h-6 text-cyber-purple" />
                </div>
                <h4 className="text-sm font-bold text-gray-300">Adversary Scanner</h4>
                <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                  Start a conversation with an adversary caller on the left panel. Avoid compliance traps to win.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
