import React, { useState, useEffect } from 'react';
import Card from './Shared/Card';
import Button from './Shared/Button';
import { HEALTH_QUIZ } from '../utils/mockData';
import { ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export default function HealthAdvisor() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  // Check if there is a previously calculated score
  useEffect(() => {
    const savedScore = localStorage.getItem('cybershield_health_score');
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
      setCompleted(true);
      const savedRecs = localStorage.getItem('cybershield_health_recommendations');
      if (savedRecs) {
        setRecommendations(JSON.parse(savedRecs));
      }
    }
  }, []);

  const handleSelectOption = (optIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIndex
    }));
  };

  const handleNext = () => {
    if (currentIdx < HEALTH_QUIZ.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    const recs = [];

    HEALTH_QUIZ.forEach((question, idx) => {
      const selectedOptIdx = answers[idx];
      const option = question.options[selectedOptIdx];
      if (option) {
        totalScore += option.score;
        if (option.recommendations && option.recommendations.length > 0) {
          recs.push(...option.recommendations);
        }
      }
    });

    // Score scale: 10 points max per question * 5 questions = 50 max points.
    // Convert to percentage (multiply by 2)
    const percentageScore = totalScore * 2;

    setScore(percentageScore);
    setRecommendations(recs);
    setCompleted(true);

    localStorage.setItem('cybershield_health_score', percentageScore.toString());
    localStorage.setItem('cybershield_health_recommendations', JSON.stringify(recs));
    
    // Add XP rewards
    const savedXp = parseInt(localStorage.getItem('cybershield_xp') || '0', 10);
    localStorage.setItem('cybershield_xp', (savedXp + 50).toString());
  };

  const retakeQuiz = () => {
    setAnswers({});
    setCurrentIdx(0);
    setCompleted(false);
    setScore(0);
    setRecommendations([]);
  };

  const currentQuestion = HEALTH_QUIZ[currentIdx];
  const isOptionSelected = answers[currentIdx] !== undefined;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-cyber-green';
    if (score >= 50) return 'text-cyber-yellow';
    return 'text-cyber-red';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Security Health Score</h2>
        <p className="text-gray-400 text-sm mt-1">
          Audit your personal online habits, identify weak configurations, and receive a customized protection checklist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Quiz/Result Panel */}
        <div className="lg:col-span-2 space-y-6">
          {!completed ? (
            <Card className="min-h-[350px] flex flex-col justify-between">
              <div>
                {/* Progress Indicators */}
                <div className="flex justify-between items-center text-xs text-gray-500 font-mono mb-6">
                  <span>Question {currentIdx + 1} of {HEALTH_QUIZ.length}</span>
                  <span>{Math.round(((currentIdx) / HEALTH_QUIZ.length) * 100)}% Complete</span>
                </div>
                
                <div className="w-full bg-cyber-lightGray h-1.5 rounded-full overflow-hidden mb-8">
                  <div 
                    className="h-full bg-cyber-cyan transition-all duration-300"
                    style={{ width: `${((currentIdx) / HEALTH_QUIZ.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-lg font-bold text-white leading-relaxed">
                    {currentQuestion.question}
                  </h3>

                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(oIdx)}
                        className={`w-full p-4 border rounded-xl text-left text-sm transition-all hover:bg-cyber-lightGray/40 leading-relaxed ${
                          answers[currentIdx] === oIdx
                            ? 'border-cyber-cyan bg-cyber-cyan/5 text-white'
                            : 'border-cyber-border/40 bg-cyber-black/40 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            answers[currentIdx] === oIdx ? 'border-cyber-cyan text-cyber-cyan' : 'border-cyber-border'
                          }`}>
                            {answers[currentIdx] === oIdx && <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan" />}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center border-t border-cyber-border/40 pt-6 mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="text-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!isOptionSelected}
                  className="text-xs"
                >
                  {currentIdx === HEALTH_QUIZ.length - 1 ? 'Calculate Score' : 'Next'} <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </Card>
          ) : (
            /* Result Panel */
            <Card className="min-h-[350px] flex flex-col justify-between">
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-sans">Habits Audit Complete</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Your calculated Security Health Score is:
                  </p>
                </div>
                <div className="text-6xl font-black font-sans py-4">
                  <span className={getScoreColor(score)}>{score}</span>
                  <span className="text-sm font-medium text-gray-500">/100</span>
                </div>
                <div className="max-w-md mx-auto text-xs text-gray-400 leading-relaxed font-sans">
                  {score >= 80 ? (
                    "Excellent security consciousness. Your answers reflect robust protection structures, separate passwords, and enabled 2FA. Keep up the clean habits!"
                  ) : score >= 50 ? (
                    "Decent baseline security, but you have key vulnerabilities (e.g. reused passwords or lack of app-based MFA) that could let hackers compromise multiple accounts in one go."
                  ) : (
                    "CRITICAL: Your current setups expose you to credential stuffing, malware hijacking, and account takeover. Please apply the recommendations on the right side panel immediately."
                  )}
                </div>
              </div>

              <div className="border-t border-cyber-border/40 pt-6 mt-8 flex justify-center">
                <Button variant="outline" onClick={retakeQuiz} className="text-xs">
                  <RefreshCw className="w-3.5 h-3.5" /> Audit Security Habits Again
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Right Side: Action Checklist */}
        <div className="lg:col-span-1">
          {completed ? (
            <Card className="h-full border-t-4 border-t-cyber-cyan flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-cyber-border/40 pb-3">
                  <AlertTriangle className="w-5 h-5 text-cyber-yellow" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Actionable Action Checklist</h3>
                    <p className="text-[10px] text-gray-500 font-mono">Found {recommendations.length} Weakspots</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {recommendations.length > 0 ? (
                    <div className="space-y-3">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="p-3 bg-cyber-black/40 border border-cyber-border/30 rounded-lg text-xs leading-relaxed text-gray-300 flex items-start gap-2">
                          <span className="text-cyber-cyan font-bold select-none">•</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-3">
                      <div className="w-10 h-10 bg-cyber-green/10 border border-cyber-green/30 rounded-full flex items-center justify-center text-cyber-green mx-auto">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-white">All Clear!</h4>
                      <p className="text-xs text-gray-500 leading-relaxed max-w-[180px] mx-auto">
                        Zero weaknesses identified. You meet all recommended defense rules.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-cyber-border/40 pt-4 mt-6 text-[10px] text-gray-500 font-mono">
                💡 Habits checked cover MFA methods, credentials uniqueness, system updates, and network security.
              </div>
            </Card>
          ) : (
            <Card className="h-full border-dashed border-cyber-border/60 flex flex-col items-center justify-center p-8 text-center min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-cyber-lightGray/50 border border-cyber-border/60 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
                <ShieldCheck className="w-6 h-6 text-cyber-cyan" />
              </div>
              <h4 className="text-sm font-bold text-gray-300">Analysis Logs</h4>
              <p className="text-xs text-gray-500 max-w-xs mt-1.5 leading-relaxed">
                Take the cybersecurity habits questionnaire on the left panel to output security risk logs and recommendations.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
