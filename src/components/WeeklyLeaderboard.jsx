import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { DEMO_PLAYER_NAMES } from '../data/constants';

const WeeklyLeaderboard = ({ playerUID, playerName, weeklyXP }) => {
  const [weeklyBoard, setWeeklyBoard] = useState([]);
  const [daysUntilReset, setDaysUntilReset] = useState(5);

  useEffect(() => {
    // Generar semanal simulado
    const mock = DEMO_PLAYER_NAMES.slice(0, 15).map((name, idx) => ({
      id: idx,
      name,
      weeklyXP: Math.floor(Math.random() * 10000),
      questsCompleted: Math.floor(Math.random() * 20),
      streak: Math.floor(Math.random() * 7)
    }));

    mock.push({
      id: playerUID,
      name: playerName,
      weeklyXP,
      questsCompleted: 5,
      streak: 3
    });

    mock.sort((a, b) => b.weeklyXP - a.weeklyXP);
    setWeeklyBoard(mock);

    // Calcular días hasta reset (lunes)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = dayOfWeek === 1 ? 7 : (1 - dayOfWeek + 7) % 7;
    setDaysUntilReset(daysUntilMonday || 7);
  }, [playerUID, playerName, weeklyXP]);

  const getMedal = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return '⭐';
  };

  const rewards = [
    { position: 1, name: '1er Lugar', xp: 1000, coins: 500 },
    { position: 2, name: '2do Lugar', xp: 500, coins: 300 },
    { position: 3, name: '3er Lugar', xp: 200, coins: 100 }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 flex items-center gap-2">
        <Clock size={20} className="text-white" />
        <div>
          <p className="text-sm font-bold text-white">Reset en</p>
          <p className="text-2xl font-black text-yellow-200">{daysUntilReset} días (Lunes)</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[250px] overflow-y-auto">
        {weeklyBoard.map((player, idx) => {
          const isMe = player.id === playerUID;
          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg border-2 animate-tier-glow ${
                isMe
                  ? 'bg-purple-500/20 border-purple-400'
                  : 'bg-slate-800/30 border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-2xl">{getMedal(idx + 1)}</span>
                <div>
                  <p className={`font-bold ${isMe ? 'text-purple-300' : 'text-white'}`}>
                    {player.name} {isMe && '👤'}
                  </p>
                  <p className="text-xs text-slate-400">{player.questsCompleted} quests • 🔥 {player.streak}</p>
                </div>
              </div>
              <p className="font-black text-lg text-purple-300">{player.weeklyXP.toLocaleString()} XP</p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-800/30 border border-slate-600 rounded-lg p-4">
        <p className="font-bold text-cyan-300 mb-3">Recompensas</p>
        {rewards.map(r => (
          <div key={r.position} className="flex justify-between text-sm mb-2 pb-2 border-b border-slate-700 last:border-0">
            <span className="text-white">{r.name}</span>
            <span className="text-emerald-400">+{r.xp} XP • +{r.coins} coins</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyLeaderboard;
