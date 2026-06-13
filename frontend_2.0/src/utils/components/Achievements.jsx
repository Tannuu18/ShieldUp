import React, { useState, useEffect } from 'react';
import Card from './Shared/Card';
import { ACHIEVEMENTS } from '../mockData';
import { Award, Flame, Target, Trophy, Lock } from 'lucide-react';

export default function Achievements() {
  const [xp, setXp] = useState(450);
  const [streak, setStreak] = useState(5);
  const [scamsCaught, setScamsCaught] = useState(12);
  const [healthScore, setHealthScore] = useState(68);

  useEffect(() => {
    const savedXp = localStorage.getItem('cybershield_xp');
    if (savedXp) setXp(parseInt(savedXp, 10));

    const savedStreak = localStorage.getItem('cybershield_streak');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    const savedScams = localStorage.getItem('cybershield_scams_detected');
    if (savedScams) setScamsCaught(parseInt(savedScams, 10));

    const savedScore = localStorage.getItem('cybershield_health_score');
    if (savedScore) setHealthScore(parseInt(savedScore, 10));
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  const isUnlocked = (badgeId) => {
    if (badgeId === 'hunter') return scamsCaught >= 1 || xp >= 100;
    if (badgeId === 'detective') return scamsCaught >= 3 || xp >= 200;
    if (badgeId === 'defender') return healthScore === 100 || xp >= 300;
    if (badgeId === 'streak') return streak >= 3 || xp >= 150;
    return false;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold text-white">Achievements & Awareness</h2>
        <p className="text-gray-400 text-sm mt-1">
          Monitor your progress level, streaks, and check unlocked cybersecurity badges.
        </p>
      </div>

      {/* Main progress summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex items-center gap-4 py-6" hover={false}>
          <div className="w-12 h-12 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-mono font-bold">Total Level</div>
            <div className="text-2xl font-black text-white">Lvl {level}</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 py-6" hover={false}>
          <div className="w-12 h-12 rounded-xl bg-cyber-purple/15 border border-cyber-purple/30 flex items-center justify-center text-cyber-purple shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-mono font-bold">Total XP Score</div>
            <div className="text-2xl font-black text-white">{xp} XP</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 py-6" hover={false}>
          <div className="w-12 h-12 rounded-xl bg-cyber-magenta/15 border border-cyber-magenta/30 flex items-center justify-center text-cyber-magenta shrink-0">
            <Flame className="w-6 h-6 text-cyber-magenta fill-cyber-magenta/10" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-mono font-bold">Day Streak</div>
            <div className="text-2xl font-black text-white">{streak} Days</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4 py-6" hover={false}>
          <div className="w-12 h-12 rounded-xl bg-cyber-green/15 border border-cyber-green/30 flex items-center justify-center text-cyber-green shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase font-mono font-bold">Scams Exposed</div>
            <div className="text-2xl font-black text-white">{scamsCaught} Scams</div>
          </div>
        </Card>
      </div>

      {/* Progress Level bar details */}
      <Card hover={false} className="space-y-4">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Level {level} Progress</span>
          <span className="font-mono text-white">{xpInCurrentLevel} / 100 XP to Level {level + 1}</span>
        </div>
        <div className="w-full bg-cyber-lightGray h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple shadow-[0_0_10px_#8B5CF6] transition-all duration-300"
            style={{ width: `${xpInCurrentLevel}%` }}
          />
        </div>
      </Card>

      {/* Badge List Grid */}
      <div>
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Unlocked Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACHIEVEMENTS.map((badge) => {
            const unlocked = isUnlocked(badge.id);
            return (
              <Card
                key={badge.id}
                hover={unlocked}
                className={`flex flex-col items-center justify-between text-center min-h-[220px] transition-all relative ${
                  unlocked 
                    ? 'border-cyber-cyan/35 bg-gradient-to-b from-cyber-gray to-cyber-cyan/5 shadow-glow-cyan' 
                    : 'border-cyber-border/20 bg-cyber-black/40 opacity-55'
                }`}
              >
                {!unlocked && (
                  <div className="absolute top-3 right-3 text-gray-600" aria-label="Locked Achievement">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div className={`text-5xl my-4 filter transition-all duration-300 ${unlocked ? 'drop-shadow-[0_0_8px_rgba(0,240,255,0.4)] scale-105' : 'grayscale'}`}>
                  {badge.icon}
                </div>
                <div>
                  <h4 className={`text-md font-extrabold ${unlocked ? 'text-white' : 'text-gray-500'}`}>{badge.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed px-2">
                    {badge.desc}
                  </p>
                </div>
                <div className="mt-4 w-full">
                  <span className={`text-[9px] px-2 py-0.5 font-mono uppercase font-bold rounded ${
                    unlocked ? 'bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30' : 'bg-cyber-lightGray text-gray-600 border border-cyber-border/40'
                  }`}>
                    {unlocked ? 'Unlocked' : `Requires ${badge.xpRequired} XP`}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
