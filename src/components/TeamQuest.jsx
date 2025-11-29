import React, { useState } from 'react';
import { Target, Play } from 'lucide-react';
import { TEAM_CONFIG } from '../data/constants';

const TeamQuest = ({ selectedTeam, onQuestStart, onQuestComplete }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [isQuestActive, setIsQuestActive] = useState(false);
  const [questProgress, setQuestProgress] = useState(0);

  const startQuest = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setIsQuestActive(true);
    setQuestProgress(0);
    onQuestStart(difficulty);
  };

  const completeQuest = () => {
    setIsQuestActive(false);
    const config = TEAM_CONFIG.QUEST_DIFFICULTIES[selectedDifficulty];
    onQuestComplete({
      difficulty: selectedDifficulty,
      xpReward: Math.floor(500 * config.xpMultiplier),
      coinReward: Math.floor(100 * config.coinMultiplier),
      teamSize: selectedTeam.members.length
    });
  };

  if (!selectedTeam) {
    return (
      <div className="text-center py-8 text-slate-400">
        Selecciona un equipo para comenzar quests
      </div>
    );
  }

  if (isQuestActive) {
    return (
      <div className="bg-slate-800/50 border-2 border-purple-500/50 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-black text-white">🎯 Quest Activo</h3>
        <p className="text-slate-300">{selectedTeam.members.join(', ')}</p>
        
        <div className="bg-slate-700 rounded-full h-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all animate-health-pulse"
            style={{ width: `${questProgress}%` }}
          />
        </div>
        <p className="text-center text-slate-300 text-sm">{questProgress}% completado</p>

        <button
          onClick={() => {
            setQuestProgress(Math.min(100, questProgress + 20));
            if (questProgress >= 80) completeQuest();
          }}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black py-3 rounded-lg transition"
        >
          Progreso de Quest
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-cyan-300 flex items-center gap-2">
        <Target size={18} /> Quests Disponibles
      </h3>

      {Object.entries(TEAM_CONFIG.QUEST_DIFFICULTIES).map(([key, config]) => (
        <button
          key={key}
          onClick={() => startQuest(key)}
          className="w-full bg-slate-800/50 hover:bg-slate-700/50 border-2 border-slate-600 hover:border-purple-500/50 rounded-lg p-4 text-left transition-all transform hover:scale-102"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-white">{config.name}</p>
              <p className="text-xs text-slate-400">
                {Math.floor(500 * config.xpMultiplier)} XP • {Math.floor(100 * config.coinMultiplier)} coins
              </p>
            </div>
            <Play size={20} className="text-cyan-400" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default TeamQuest;
